import { Injectable } from '@angular/core';

import { Item } from '../../models/item';
import { Api } from '../../providers/api/api';

@Injectable()
export class Items {
  items: Item[] = [];
  wlItems: Item[] = [];

  defaultItem: any = {
    "name": ""
  };

  constructor(public api: Api) {}

  query(params?: any) {
    var obj;
    var xmlhttp = new XMLHttpRequest();

    this.items = [];

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = xmlhttp.responseText;

            obj = JSON.parse(response);
        }
    };
    xmlhttp.open("GET", "http://ec2-54-166-214-152.compute-1.amazonaws.com:8081/group/" + params, false);
    
    xmlhttp.send();

    if (obj != null) {
      for (var i = 0; i < obj.recordset.length; i++) {
          this.items.push(new Item({"name": obj.recordset[i].Group}));
      }
    }

    return this.items;
  }

  queryPWL(email: string, group: string) {
    var obj;
    var xmlhttp = new XMLHttpRequest();

    this.wlItems = [];

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = xmlhttp.responseText;

            obj = JSON.parse(response);
        }
    };
    xmlhttp.open("GET", "http://ec2-54-166-214-152.compute-1.amazonaws.com:8081/mywl/" + email + "/'" + group + "'", false);

    xmlhttp.send();

    if (obj != null) {
      for (var i = 0; i < obj.recordset.length; i++) {
        this.wlItems.push(new Item({"name": obj.recordset[i].Item}));
      }
    }

    return this.wlItems;
  }

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}
