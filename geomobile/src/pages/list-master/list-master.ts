import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  partnerWL: Item[];
  partner: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public items: Items, public modalCtrl: ModalController) {
    // Load the Group selection list
    this.currentItems = this.items.query(this.navParams.get('email'));
  }

  /**
   * The view loaded, let's query our items for the list
  */
  ionViewDidLoad() {
  }

  /*
    Handle changes to the Group selection
  */
  onChange(event) {
    // Get the partner's wishlist items
    try {
      this.partnerWL = this.items.queryPWL(this.getPartnerEmail(this.getMatchName(this.navParams.get('email'), event)), event);
    }
    catch {
      this.partnerWL = [];
    }

    var ul = document.getElementById("wishlistItems");

    // Clear the current items in the ul
    while (ul.hasChildNodes()) {  
      ul.removeChild(ul.firstChild);
    }

    // Populate the ul with the new items
    for (var i = 0; i < this.partnerWL.length; i++) {
        var item = this.partnerWL[i];
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(item.name));
        ul.appendChild(li);
    }
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }
  
  /*
      Get match name for user/group
  */
  getMatchName(email, group): string {
    var obj;
    var xmlhttp = new XMLHttpRequest();
    var matchName = "";

    try {
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var response = xmlhttp.responseText;

                obj = JSON.parse(response);

                if (response == '{"recordsets":[[]],"recordset":[],"output":{},"rowsAffected":[0]}') {
                    document.getElementById("partnerName").innerHTML = "<b>Partner Name:</b> N/A";
                }
                else {
                    document.getElementById("partnerName").innerText = "Partner Name: " + obj.recordset[0].MatchName;
                    matchName = obj.recordset[0].MatchName;
                }
            }
        };
        xmlhttp.open("GET", "http://ec2-54-166-214-152.compute-1.amazonaws.com:8081/matchname/" + email + "/'" + group + "'", false);
        
        xmlhttp.send(); 
    }
    catch(err) {
        alert(err.message);
    }

    return matchName;
  }

  getPartnerEmail(name):string {
    var obj;
    var xmlhttp = new XMLHttpRequest();
  
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = xmlhttp.responseText;
  
            obj = JSON.parse(response);
        }
    };
  
    xmlhttp.open("GET", "http://ec2-54-166-214-152.compute-1.amazonaws.com:8081/PartnerEmail/'" + name + "'", false);
        
    xmlhttp.send();
  
    return obj.recordset[0].Email;
  }
}

