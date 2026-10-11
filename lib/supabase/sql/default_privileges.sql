-- New tables and sequences in public start with no access for signed-in users.
-- Each new table then needs an explicit grant, written next to its policies.
alter default privileges for role postgres in schema public
  revoke all on tables from authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from authenticated;
