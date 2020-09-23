import { SDKKinds } from '@bfc/shared';
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  decodeDesignerPathToArrayPath,
  encodeArrayPathToDesignerPath,
} from '../../../src/utils/convertUtils/designerPathEncoder';

const dialog = {
  triggers: [
    {
      $kind: SDKKinds.OnIntent,
      $designer: { id: '1234' },
      actions: [
        {
          $kind: SDKKinds.SendActivity,
          $designer: { id: '5678' },
        },
        {
          $kind: SDKKinds.SendActivity,
        },
      ],
    },
  ],
};

describe('encodeArrayPathToDesignerPath()', () => {
  it('should transform valid array path.', () => {
    expect(encodeArrayPathToDesignerPath(dialog, 'triggers[0].actions[0]')).toEqual(`triggers['1234'].actions['5678']`);
  });

  it('can handle subdata without $designer.id.', () => {
    expect(encodeArrayPathToDesignerPath(dialog, 'triggers[0].actions[1]')).toEqual(`triggers['1234'].actions[1]`);
  });

  it('can recover from invalid array path.', () => {
    expect(encodeArrayPathToDesignerPath(dialog, 'triggers[0].actions[99]')).toEqual(null);
  });
});

describe('decodeDesignerPathToArrayPath()', () => {
  it('should transform valid designer path.', () => {
    expect(decodeDesignerPathToArrayPath(dialog, `triggers['1234'].actions['5678']`)).toEqual('triggers[0].actions[0]');
  });

  it('can handle valid designer path.', () => {
    expect(decodeDesignerPathToArrayPath(dialog, `triggers['1234'].actions['9999']`)).toEqual(null);
    expect(decodeDesignerPathToArrayPath(dialog, `triggers['5678'].actions['1234']`)).toEqual(null);
    expect(decodeDesignerPathToArrayPath(dialog, `dialogs['1234'].actions['5678']`)).toEqual(null);
  });
});