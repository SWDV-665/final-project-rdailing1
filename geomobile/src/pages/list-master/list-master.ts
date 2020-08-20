import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';

  // // Below line commented for testing
// import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';


@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  partnerWL: Item[];
  partner: string;
  group: string = "";
  segment:string = "partner";
  encodeData: any;
  barcodeScannerOptions: BarcodeScannerOptions;

  // // Below line commented for testing
  // constructor(public navCtrl: NavController, public navParams: NavParams, public items: Items, public modalCtrl: ModalController, private barcodeScanner: BarcodeScanner) {
  constructor(public navCtrl: NavController, public navParams: NavParams, public items: Items, public modalCtrl: ModalController) {
    // Load the Group selection list
    this.currentItems = this.items.query(this.navParams.get('email'));

    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  /**
   * The view loaded, let's query our items for the list
  */
  ionViewDidLoad() {
    // Hide the barcode scanner button after page load (should only be visible on the "me" slide)
    document.getElementById("scan").style.visibility = "hidden";
  }

  /*
    Handle changes to the Group selection
  */
  onChange(event) {
    this.group = event;

    // Get the wishlist items
    try {
      if (this.segment == "partner") {
        document.getElementById("scan").style.visibility = "hidden";
        this.partnerWL = this.items.queryPWL(this.getPartnerEmail(this.getMatchName(this.navParams.get('email'), this.group)), this.group);
      }
      else {
        document.getElementById("scan").style.visibility = "visible";
        document.getElementById("partnerName").innerHTML = "";
        this.partnerWL = this.items.queryPWL(this.navParams.get('email'), this.group);
      }
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
  addItem(event) {
    // Below line added for testing
    alert("Scanned!");

    // // Below section commented for testing
    // this.barcodeScanner
    //   .scan()
    //   .then(barcodeData => {
    //     alert("Barcode data " + JSON.stringify(barcodeData));
        
    //     var ul = document.getElementById("wishlistItems");
    //     var li = document.createElement('li');
    //     li.appendChild(document.createTextNode(barcodeData.text));
    //     ul.appendChild(li);
    //   })
    //   .catch(err => {
    //     console.log("Error", err);
    //   });
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

  segmentChanged(event: any) {
    if (this.group != "") {
      this.onChange(this.group);
    }
  }

}

