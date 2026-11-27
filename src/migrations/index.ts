import * as migration_20261027_123202 from './20261027_123202';
import * as migration_20261027_123203_create_backend_rate_limits from './20261027_123203_create_backend_rate_limits';
import * as migration_20261027_124613_align_inquiry_contract from './20261027_124613_align_inquiry_contract';
import * as migration_20261027_133609_page_owner_approval from './20261027_133609_page_owner_approval';
import * as migration_20261027_134004_full_homepage_editor from './20261027_134004_full_homepage_editor';
import * as migration_20261122_173000_remove_site_content_globals from './20261122_173000_remove_site_content_globals';
import * as migration_20261127_120000_kit_signup_fields from './20261127_120000_kit_signup_fields';
import * as migration_20261127_130000_picks from './20261127_130000_picks';
import * as migration_20261127_180000_enforce_retention_task from './20261127_180000_enforce_retention_task';
import * as migration_20261127_210000_remove_shop_interest from './20261127_210000_remove_shop_interest';

export const migrations = [
  {
    up: migration_20261027_123202.up,
    down: migration_20261027_123202.down,
    name: '20261027_123202',
  },
  {
    up: migration_20261027_123203_create_backend_rate_limits.up,
    down: migration_20261027_123203_create_backend_rate_limits.down,
    name: '20261027_123203_create_backend_rate_limits',
  },
  {
    up: migration_20261027_124613_align_inquiry_contract.up,
    down: migration_20261027_124613_align_inquiry_contract.down,
    name: '20261027_124613_align_inquiry_contract',
  },
  {
    up: migration_20261027_133609_page_owner_approval.up,
    down: migration_20261027_133609_page_owner_approval.down,
    name: '20261027_133609_page_owner_approval',
  },
  {
    up: migration_20261027_134004_full_homepage_editor.up,
    down: migration_20261027_134004_full_homepage_editor.down,
    name: '20261027_134004_full_homepage_editor'
  },
  {
    up: migration_20261122_173000_remove_site_content_globals.up,
    down: migration_20261122_173000_remove_site_content_globals.down,
    name: '20261122_173000_remove_site_content_globals'
  },
  {
    up: migration_20261127_120000_kit_signup_fields.up,
    down: migration_20261127_120000_kit_signup_fields.down,
    name: '20261127_120000_kit_signup_fields'
  },
  {
    up: migration_20261127_130000_picks.up,
    down: migration_20261127_130000_picks.down,
    name: '20261127_130000_picks'
  },
  {
    up: migration_20261127_180000_enforce_retention_task.up,
    down: migration_20261127_180000_enforce_retention_task.down,
    name: '20261127_180000_enforce_retention_task'
  },
  {
    up: migration_20261127_210000_remove_shop_interest.up,
    down: migration_20261127_210000_remove_shop_interest.down,
    name: '20261127_210000_remove_shop_interest'
  },
];
