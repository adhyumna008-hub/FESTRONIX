ALTER TABLE teams ADD COLUMN transfer_to uuid REFERENCES users(id);
ALTER TABLE teams ADD COLUMN transfer_expires_at timestamptz;
ALTER TABLE event_revisions ADD COLUMN waitlist_offer_minutes integer NOT NULL DEFAULT 120 CHECK(waitlist_offer_minutes BETWEEN 15 AND 1440);
CREATE INDEX proof_registration ON proof_objects(registration_id);
CREATE INDEX payment_event_queue ON payment_submissions(event_id,status,created_at);
CREATE INDEX announcement_scope_time ON announcements(edition_id,published_at DESC);
CREATE INDEX session_revision_time ON event_sessions(revision_id,starts_at);

-- Defense in depth: a confirmed paid entry requires approved evidence even if
-- a future service accidentally bypasses the payment service. Deferred so the
-- registration and proof decision can be updated atomically in either order.
CREATE FUNCTION enforce_paid_confirmation() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE rid uuid;
BEGIN
 IF TG_TABLE_NAME='registrations' THEN rid:=NEW.id; ELSE rid:=NEW.registration_id; END IF;
 IF EXISTS(SELECT 1 FROM registrations r JOIN event_revisions v ON v.id=r.revision_id
   WHERE r.id=rid AND r.status='CONFIRMED' AND v.fee_paise>0
   AND NOT EXISTS(SELECT 1 FROM payment_submissions p WHERE p.registration_id=r.id AND p.status='APPROVED')) THEN
   RAISE EXCEPTION 'Paid confirmation requires approved payment' USING ERRCODE='23514';
 END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER paid_confirmation_registration AFTER INSERT OR UPDATE ON registrations DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION enforce_paid_confirmation();
CREATE CONSTRAINT TRIGGER paid_confirmation_payment AFTER INSERT OR UPDATE ON payment_submissions DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION enforce_paid_confirmation();

CREATE FUNCTION enforce_ticket_eligibility() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM tickets t JOIN registration_members m ON m.id=t.member_id
   JOIN registrations r ON r.id=t.registration_id WHERE t.id=NEW.id AND t.status IN ('ACTIVE','CHECKED_IN')
   AND (r.status<>'CONFIRMED' OR m.withdrawn_at IS NOT NULL)) THEN
   RAISE EXCEPTION 'Active ticket requires eligible confirmed member' USING ERRCODE='23514';
 END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER ticket_eligibility AFTER INSERT OR UPDATE ON tickets DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION enforce_ticket_eligibility();
