import { Component, Input } from '@angular/core';

import { SettingItem } from '../../../../modules/eo-ui/setting/setting.component';
import { StoreService } from '../../../../shared/store/state.service';
import { WorkspaceDeleteComponent } from '../delete/workspace-delete.component';
import { WorkspaceEditComponent } from '../edit/workspace-edit.component';
import { WorkspaceMemberComponent } from '../member/workspace-member.component';

@Component({
  selector: 'eo-workspace-setting',
  template: ` <eo-setting [selectedModule]="selectedModule" [model]="model" [nzData]="treeNodes"></eo-setting>`,
  styleUrls: ['./workspace-setting.component.scss']
})
export class WorkspaceSettingComponent {
  constructor(private store: StoreService) {}
  @Input() selectedModule: string;
  @Input() model: any;
  treeNodes: SettingItem[] = [
    ...(this.store.getWorkspaceRole === 'admin'
      ? [
          {
            title: $localize`General`,
            id: 'general',
            comp: WorkspaceEditComponent
          }
        ]
      : []),
    {
      title: $localize`Member`,
      id: 'member',
      comp: WorkspaceMemberComponent
    },
    ...(this.store.getWorkspaceRole === 'admin'
      ? [
          {
            title: $localize`Delete`,
            id: 'delete',
            comp: WorkspaceDeleteComponent
          }
        ]
      : [])
  ];
}