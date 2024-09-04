import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'user',
    title: 'User-Mat Table',
    type: 'item',
    url: '/user',
    icon: 'feather icon-user',
    classes: 'nav-item',
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
