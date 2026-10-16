CREATE TABLE users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), display_name text NOT NULL CHECK(length(display_name) BETWEEN 1 AND 120),
 email text, is_student boolean NOT NULL DEFAULT true, institution text, institution_type text,
 academic_year integer CHECK(academic_year BETWEEN 1 AND 12), branch text, age_years integer CHECK(age_years BETWEEN 10 AND 100),
 disabled_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE identities (
 provider text NOT NULL CHECK(provider='FIREBASE'), subject text NOT NULL, user_id uuid NOT NULL REFERENCES users(id),
 PRIMARY KEY(provider,subject), UNIQUE(provider,user_id)
);
CREATE TABLE editions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE, display_name text NOT NULL,
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL, timezone text NOT NULL DEFAULT 'Asia/Kolkata',
 state text NOT NULL DEFAULT 'PREPARATION' CHECK(state IN ('PREPARATION','READY','ACTIVE','CLOSED','ARCHIVED','CANCELLED')),
 admissions_open boolean NOT NULL DEFAULT false, theme text NOT NULL DEFAULT 'Pulse' CHECK(theme IN ('Pulse','Panel','Flux')),
 created_by uuid NOT NULL REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(ends_at > starts_at), CHECK(NOT admissions_open OR state='ACTIVE')
);
CREATE UNIQUE INDEX one_active_edition ON editions((true)) WHERE state='ACTIVE';
CREATE UNIQUE INDEX one_admitting_edition ON editions((true)) WHERE admissions_open;
CREATE TABLE events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), edition_id uuid NOT NULL REFERENCES editions(id), slug text NOT NULL,
 status text NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','IN_REVIEW','CHANGES_REQUESTED','REJECTED','APPROVED','PUBLISHED','LIVE','ENDED','COMPLETED','CANCELLED','ARCHIVED')),
 registration_state text NOT NULL DEFAULT 'CLOSED' CHECK(registration_state IN ('OPEN','PAUSED','CLOSED')),
 active_revision_id uuid, created_by uuid NOT NULL REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(edition_id,slug), UNIQUE(id,edition_id)
);
CREATE TABLE roles (code text PRIMARY KEY, scope text NOT NULL CHECK(scope IN ('GLOBAL','EDITION','EVENT','SELF')));
INSERT INTO roles VALUES ('PRIMARY_FACULTY_OWNER','GLOBAL'),('BACKUP_FACULTY_OWNER','GLOBAL'),
 ('FACULTY_ADMIN','EDITION'),('FACULTY_APPROVER','EDITION'),('CORE_TEAM','EDITION'),
 ('EVENT_COORDINATOR','EVENT'),('VOLUNTEER_SCANNER','EVENT'),('PARTICIPANT','SELF');
CREATE TABLE role_assignments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id), role_code text NOT NULL REFERENCES roles(code),
 edition_id uuid REFERENCES editions(id), event_id uuid, starts_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz,
 granted_by uuid NOT NULL REFERENCES users(id), reason text NOT NULL, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(event_id,edition_id) REFERENCES events(id,edition_id),
 CHECK(expires_at IS NULL OR expires_at > starts_at),
 CHECK((role_code IN ('PRIMARY_FACULTY_OWNER','BACKUP_FACULTY_OWNER') AND edition_id IS NULL AND event_id IS NULL AND expires_at IS NULL)
 OR (role_code IN ('FACULTY_ADMIN','FACULTY_APPROVER','CORE_TEAM') AND edition_id IS NOT NULL AND event_id IS NULL AND expires_at IS NOT NULL)
 OR (role_code IN ('EVENT_COORDINATOR','VOLUNTEER_SCANNER') AND edition_id IS NOT NULL AND event_id IS NOT NULL AND expires_at IS NOT NULL))
);
CREATE INDEX role_authorization ON role_assignments(user_id,edition_id,event_id) WHERE revoked_at IS NULL;
CREATE UNIQUE INDEX owner_one_role_per_person ON role_assignments(user_id) WHERE revoked_at IS NULL AND role_code IN ('PRIMARY_FACULTY_OWNER','BACKUP_FACULTY_OWNER');
CREATE UNIQUE INDEX one_primary_owner ON role_assignments(role_code) WHERE revoked_at IS NULL AND role_code='PRIMARY_FACULTY_OWNER';
CREATE VIEW event_staff_assignments AS SELECT * FROM role_assignments WHERE event_id IS NOT NULL;
CREATE FUNCTION enforce_custodians() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM editions WHERE state='ACTIVE') AND (
 NOT EXISTS(SELECT 1 FROM role_assignments r JOIN users u ON u.id=r.user_id WHERE r.role_code='PRIMARY_FACULTY_OWNER' AND r.revoked_at IS NULL AND r.starts_at<=now() AND u.disabled_at IS NULL)
 OR NOT EXISTS(SELECT 1 FROM role_assignments r JOIN users u ON u.id=r.user_id WHERE r.role_code='BACKUP_FACULTY_OWNER' AND r.revoked_at IS NULL AND r.starts_at<=now() AND u.disabled_at IS NULL)) THEN
 RAISE EXCEPTION 'Active platform requires distinct primary and backup faculty custodians' USING ERRCODE='23514';
 END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER custody_roles AFTER INSERT OR UPDATE OR DELETE ON role_assignments DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION enforce_custodians();
CREATE CONSTRAINT TRIGGER custody_editions AFTER INSERT OR UPDATE ON editions DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION enforce_custodians();
CREATE CONSTRAINT TRIGGER custody_users AFTER UPDATE ON users DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION enforce_custodians();
CREATE TABLE event_revisions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_id uuid NOT NULL REFERENCES events(id), version integer NOT NULL,
 state text NOT NULL DEFAULT 'DRAFT' CHECK(state IN ('DRAFT','IN_REVIEW','CHANGES_REQUESTED','REJECTED','APPROVED','PUBLISHED','SUPERSEDED')),
 author_id uuid NOT NULL REFERENCES users(id), reviewer_id uuid REFERENCES users(id), review_reason text,
 title text NOT NULL, description text NOT NULL, category text NOT NULL, venue text NOT NULL,
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL, registration_opens timestamptz NOT NULL, registration_deadline timestamptz NOT NULL,
 checkin_opens timestamptz NOT NULL, checkin_closes timestamptz NOT NULL,
 capacity integer NOT NULL CHECK(capacity BETWEEN 1 AND 100000), waitlist_enabled boolean NOT NULL DEFAULT false, walkins_allowed boolean NOT NULL DEFAULT false,
 mode text NOT NULL CHECK(mode IN ('SOLO','TEAM')), team_min integer NOT NULL, team_max integer NOT NULL,
 team_edit_deadline timestamptz NOT NULL, late_substitution_policy text NOT NULL DEFAULT 'FACULTY_REVIEW',
 clash_behavior text NOT NULL DEFAULT 'WARN' CHECK(clash_behavior IN ('WARN','BLOCK')),
 fee_paise integer NOT NULL DEFAULT 0 CHECK(fee_paise>=0), payment_instructions text,
 payment_hold_minutes integer NOT NULL DEFAULT 1440 CHECK(payment_hold_minutes BETWEEN 30 AND 10080),
 allow_non_students boolean NOT NULL DEFAULT false, institution_types text[] NOT NULL DEFAULT ARRAY['COLLEGE','UNIVERSITY'],
 allowed_colleges text[] NOT NULL DEFAULT '{}', academic_years integer[] NOT NULL DEFAULT '{}', branches text[] NOT NULL DEFAULT '{}',
 minimum_age integer CHECK(minimum_age BETWEEN 10 AND 100), id_check_required boolean NOT NULL DEFAULT false,
 rules text NOT NULL DEFAULT '', certificate_policy text NOT NULL DEFAULT 'NONE' CHECK(certificate_policy IN ('NONE','ATTENDEES','WINNERS','BOTH')),
 created_at timestamptz NOT NULL DEFAULT now(), reviewed_at timestamptz, published_at timestamptz,
 UNIQUE(event_id,version), UNIQUE(id,event_id), CHECK(reviewer_id IS NULL OR reviewer_id<>author_id),
 CHECK(ends_at>starts_at AND registration_deadline>registration_opens AND checkin_closes>checkin_opens),
 CHECK(registration_deadline<=starts_at AND team_edit_deadline<=starts_at AND checkin_closes<=ends_at),
 CHECK(team_min>=1 AND team_max>=team_min AND team_max<=100 AND (mode='TEAM' OR (team_min=1 AND team_max=1))),
 CHECK(fee_paise=0 OR length(payment_instructions)>0)
);
ALTER TABLE events ADD CONSTRAINT active_revision_same_event FOREIGN KEY(active_revision_id,id) REFERENCES event_revisions(id,event_id) DEFERRABLE INITIALLY DEFERRED;
CREATE UNIQUE INDEX one_pending_revision ON event_revisions(event_id) WHERE state IN ('DRAFT','IN_REVIEW','CHANGES_REQUESTED');
CREATE TABLE event_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), revision_id uuid NOT NULL REFERENCES event_revisions(id),
 label text NOT NULL, venue text NOT NULL, starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL, CHECK(ends_at>starts_at)
);
CREATE TABLE teams (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), edition_id uuid NOT NULL, event_id uuid NOT NULL,
 name text NOT NULL, captain_id uuid NOT NULL REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(event_id,edition_id) REFERENCES events(id,edition_id), UNIQUE(id,event_id,edition_id)
);
CREATE TABLE team_members (
 team_id uuid NOT NULL, event_id uuid NOT NULL, edition_id uuid NOT NULL, user_id uuid NOT NULL REFERENCES users(id),
 accepted_at timestamptz NOT NULL DEFAULT now(), left_at timestamptz,
 PRIMARY KEY(team_id,user_id), FOREIGN KEY(team_id,event_id,edition_id) REFERENCES teams(id,event_id,edition_id)
);
CREATE UNIQUE INDEX one_active_team_per_event ON team_members(event_id,user_id) WHERE left_at IS NULL;
CREATE TABLE team_invitations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), team_id uuid NOT NULL REFERENCES teams(id), invited_user_id uuid NOT NULL REFERENCES users(id),
 invited_by uuid NOT NULL REFERENCES users(id), expires_at timestamptz NOT NULL, accepted_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE registrations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE, edition_id uuid NOT NULL, event_id uuid NOT NULL,
 revision_id uuid NOT NULL, applicant_id uuid NOT NULL REFERENCES users(id), team_id uuid,
 status text NOT NULL CHECK(status IN ('PENDING_PAYMENT','PAYMENT_VERIFICATION_PENDING','PAYMENT_REJECTED','CONFIRMED','WAITLISTED','OFFERED','ACTION_REQUIRED','CANCELLED','REJECTED')),
 hold_expires_at timestamptz, offer_expires_at timestamptz, correction_due_at timestamptz,
 eligibility_verified_at timestamptz, eligibility_verified_by uuid REFERENCES users(id),
 reason text, confirmed_at timestamptz, cancelled_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(event_id,edition_id) REFERENCES events(id,edition_id), FOREIGN KEY(revision_id,event_id) REFERENCES event_revisions(id,event_id),
 FOREIGN KEY(team_id,event_id,edition_id) REFERENCES teams(id,event_id,edition_id), UNIQUE(id,event_id,edition_id), UNIQUE(team_id),
 CHECK(status NOT IN ('PENDING_PAYMENT','PAYMENT_VERIFICATION_PENDING','PAYMENT_REJECTED') OR hold_expires_at IS NOT NULL),
 CHECK(status<>'OFFERED' OR offer_expires_at IS NOT NULL)
);
CREATE INDEX registration_event_status ON registrations(event_id,status,created_at);
CREATE TABLE registration_members (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), registration_id uuid NOT NULL, edition_id uuid NOT NULL, event_id uuid NOT NULL,
 user_id uuid NOT NULL REFERENCES users(id), withdrawn_at timestamptz,
 FOREIGN KEY(registration_id,event_id,edition_id) REFERENCES registrations(id,event_id,edition_id),
 UNIQUE(registration_id,user_id), UNIQUE(id,registration_id,event_id,edition_id)
);
CREATE UNIQUE INDEX one_active_entry_per_event ON registration_members(event_id,user_id) WHERE withdrawn_at IS NULL;
CREATE INDEX member_registrations ON registration_members(user_id,registration_id);
CREATE TABLE proof_objects (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), registration_id uuid NOT NULL REFERENCES registrations(id), owner_id uuid NOT NULL REFERENCES users(id),
 storage_key text NOT NULL UNIQUE, media_type text NOT NULL CHECK(media_type IN ('image/png','image/jpeg')),
 byte_size integer NOT NULL CHECK(byte_size BETWEEN 1 AND 2097152), content_sha256 text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,registration_id)
);
CREATE TABLE payment_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), registration_id uuid NOT NULL, edition_id uuid NOT NULL, event_id uuid NOT NULL,
 proof_id uuid NOT NULL UNIQUE, reference text NOT NULL, status text NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','APPROVED','REJECTED','SUPERSEDED')),
 submitted_by uuid NOT NULL REFERENCES users(id), reviewed_by uuid REFERENCES users(id), review_reason text, reviewed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(registration_id,event_id,edition_id) REFERENCES registrations(id,event_id,edition_id),
 FOREIGN KEY(proof_id,registration_id) REFERENCES proof_objects(id,registration_id)
);
CREATE UNIQUE INDEX one_approved_payment_reference ON payment_submissions(edition_id,reference) WHERE status='APPROVED';
CREATE UNIQUE INDEX one_pending_payment ON payment_submissions(registration_id) WHERE status='PENDING';
CREATE TABLE tickets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE, registration_id uuid NOT NULL, member_id uuid NOT NULL,
 edition_id uuid NOT NULL, event_id uuid NOT NULL, token_hash text NOT NULL UNIQUE CHECK(length(token_hash)=64),
 status text NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','CHECKED_IN','REVOKED','EXPIRED')),
 issued_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL, revoked_at timestamptz, revoked_reason text,
 FOREIGN KEY(member_id,registration_id,event_id,edition_id) REFERENCES registration_members(id,registration_id,event_id,edition_id),
 UNIQUE(id,member_id,registration_id,event_id,edition_id)
);
CREATE UNIQUE INDEX one_usable_member_ticket ON tickets(member_id) WHERE status IN ('ACTIVE','CHECKED_IN');
CREATE TABLE attendance (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), edition_id uuid NOT NULL, event_id uuid NOT NULL, registration_id uuid NOT NULL,
 member_id uuid NOT NULL, ticket_id uuid, scanner_user_id uuid NOT NULL REFERENCES users(id), scanner_assignment_id uuid NOT NULL REFERENCES role_assignments(id),
 checked_in_at timestamptz NOT NULL DEFAULT now(), method text NOT NULL CHECK(method IN ('QR','MANUAL')),
 device_label text, voided_at timestamptz, voided_by uuid REFERENCES users(id), void_reason text,
 FOREIGN KEY(member_id,registration_id,event_id,edition_id) REFERENCES registration_members(id,registration_id,event_id,edition_id),
 FOREIGN KEY(ticket_id,member_id,registration_id,event_id,edition_id) REFERENCES tickets(id,member_id,registration_id,event_id,edition_id)
);
CREATE UNIQUE INDEX one_present_record ON attendance(member_id) WHERE voided_at IS NULL;
CREATE INDEX attendance_event ON attendance(event_id,checked_in_at) WHERE voided_at IS NULL;
CREATE TABLE announcements (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), edition_id uuid NOT NULL REFERENCES editions(id), event_id uuid, team_id uuid,
 audience text NOT NULL CHECK(audience IN ('EDITION','EVENT','TEAM','PARTICIPANTS')),
 title text NOT NULL, body text NOT NULL, author_id uuid NOT NULL REFERENCES users(id), published_by uuid REFERENCES users(id), published_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(event_id,edition_id) REFERENCES events(id,edition_id), FOREIGN KEY(team_id,event_id,edition_id) REFERENCES teams(id,event_id,edition_id),
 CHECK((audience='EDITION' AND event_id IS NULL AND team_id IS NULL) OR (audience='EVENT' AND event_id IS NOT NULL AND team_id IS NULL)
 OR (audience='TEAM' AND team_id IS NOT NULL AND event_id IS NOT NULL) OR (audience='PARTICIPANTS' AND event_id IS NOT NULL AND team_id IS NULL))
);
CREATE TABLE announcement_recipients (
 announcement_id uuid NOT NULL REFERENCES announcements(id), user_id uuid NOT NULL REFERENCES users(id), PRIMARY KEY(announcement_id,user_id)
);
CREATE TABLE audit_logs (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor_id uuid REFERENCES users(id), action text NOT NULL,
 target_type text NOT NULL, target_id text NOT NULL, edition_id uuid REFERENCES editions(id), event_id uuid,
 occurred_at timestamptz NOT NULL DEFAULT now(), metadata jsonb NOT NULL DEFAULT '{}',
 FOREIGN KEY(event_id,edition_id) REFERENCES events(id,edition_id)
);
CREATE INDEX audit_scope_time ON audit_logs(edition_id,event_id,occurred_at DESC);
CREATE FUNCTION immutable_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Audit history is append-only'; END $$;
CREATE TRIGGER audit_no_mutation BEFORE UPDATE OR DELETE OR TRUNCATE ON audit_logs FOR EACH STATEMENT EXECUTE FUNCTION immutable_audit();
CREATE VIEW certificate_eligibility_basis AS
 SELECT m.id AS member_id, m.user_id, r.id AS registration_id, e.edition_id, e.id AS event_id,
 r.status='CONFIRMED' AND m.withdrawn_at IS NULL AS confirmed,
 EXISTS(SELECT 1 FROM attendance a WHERE a.member_id=m.id AND a.voided_at IS NULL) AS attended,
 e.status='COMPLETED' AS event_completed, v.certificate_policy,
 false AS faculty_release_approved
 FROM registration_members m JOIN registrations r ON r.id=m.registration_id JOIN events e ON e.id=r.event_id
 JOIN event_revisions v ON v.id=r.revision_id;
