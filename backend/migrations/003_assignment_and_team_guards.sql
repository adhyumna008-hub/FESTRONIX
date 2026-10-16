CREATE UNIQUE INDEX unique_unrevoked_assignment ON role_assignments(user_id,role_code,edition_id,event_id) NULLS NOT DISTINCT WHERE revoked_at IS NULL;
CREATE INDEX invitation_recipient ON team_invitations(invited_user_id,created_at DESC);

-- One participant belongs to at most one active team or registration for an event.
-- Cross-table consent checks remain in the locked team/registration services.
CREATE FUNCTION enforce_session_window() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM event_revisions v WHERE v.id=NEW.revision_id AND NEW.starts_at>=v.starts_at AND NEW.ends_at<=v.ends_at) THEN
   RAISE EXCEPTION 'Session must fit its approved event window' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER session_window BEFORE INSERT OR UPDATE ON event_sessions FOR EACH ROW EXECUTE FUNCTION enforce_session_window();
