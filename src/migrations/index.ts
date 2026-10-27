import * as migration_20261027_123202 from './20261027_123202';
import * as migration_20261027_123203_create_backend_rate_limits from './20261027_123203_create_backend_rate_limits';
import * as migration_20261027_124613_align_inquiry_contract from './20261027_124613_align_inquiry_contract';
import * as migration_20261027_133609_page_owner_approval from './20261027_133609_page_owner_approval';
import * as migration_20261027_134004_full_homepage_editor from './20261027_134004_full_homepage_editor';

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
];
