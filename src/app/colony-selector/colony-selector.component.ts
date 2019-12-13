import { Component, OnInit } from '@angular/core';
import { Icolony } from '../colony';
import { TouchSequence } from 'selenium-webdriver';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { IcollectionInfo } from '../collection-info';

@Component({
  selector: 'app-colony-selector',
  templateUrl: './colony-selector.component.html',
  styleUrls: ['./colony-selector.component.css']
})
export class ColonySelectorComponent implements OnInit {

  colonyList: Icolony[] = [];

  selectedColony: Icolony;
  honeyCollectionDate: Date = new Date();
  honeyCollected = 0;
  nextCollectionDate: Date;
  overproduction = 0;
  isOverProduction = false;
  today = new Date();

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.queryData();
  }
  queryData() {
    this.apollo
      .watchQuery({
        query: gql`
        {
          colony(order_by: {name: asc}) {
            id
            name
            beeCount
            hiveCount
            collectionInfo(order_by: {collectionDate: asc}) {
              colony_id
              collectionDate
              collectionAmount
            }
          }
        }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.colonyList = result.data.colony;
        if (this.selectedColony === undefined) {
          this.selectedColony = this.colonyList[0];
        }
        this.calculateData();
      });
  }

  updateData() {
    const TOGGLE_COLONY = gql`
    mutation toggleColony ($id: Int!, $_beeCount: numeric!, $_hiveCount: numeric!) {
      update_colony(where: {id: {_eq: $id}}, _set: {
        beeCount: $_beeCount
        hiveCount: $_hiveCount
        }) {
        affected_rows
      }
    }
 `;

    this.apollo.mutate({
      mutation: TOGGLE_COLONY,
      variables: { id: this.selectedColony.id, _beeCount: this.selectedColony.beeCount, _hiveCount: this.selectedColony.hiveCount },
    }).subscribe(({ data }) => {
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  insertCollectionData(colonyId: number, collectionDate: Date, collectionAmount: number): IcollectionInfo {
    const ADD_COLLECTIONINFO = gql`
    mutation ($_colony_id: Int!, $_collectionDate: date!, $_collectionAmount: numeric!) {
      insert_collectionInfo(objects: {
        colony_id: $_colony_id,
        collectionDate: $_collectionDate,
        collectionAmount: $_collectionAmount
      }) {
        affected_rows
        returning {
          id
          colony_id
          collectionDate
          collectionAmount
        }
      }
    }
   `;

    this.apollo.mutate({
      mutation: ADD_COLLECTIONINFO,
      variables: { _colony_id: colonyId, _collectionDate: collectionDate, _collectionAmount: collectionAmount },
    }).subscribe((data: any) => {
      console.log('inserted data', data);
      this.queryData();
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
    return;
  }

  insertNewColony(name: string, beeCount: number, hiveCount: number) {
    const ADD_NEWCOLONY = gql`
    mutation ($_name: String!, $_beeCount: numeric!, $_hiveCount: numeric!) {
      insert_colony(objects: {
        name: $_name,
        beeCount: $_beeCount,
        hiveCount: $_hiveCount,
      }) {
        affected_rows
        returning {
          id,
          name,
          beeCount,
          hiveCount,
        }
      }
    }
   `;

    this.apollo.mutate({
      mutation: ADD_NEWCOLONY,
      variables: { _name: name, _beeCount: beeCount, _hiveCount: hiveCount },
    }).subscribe((data: any) => {
      console.log('inserted data', data);
      const newColony = {
        id: data.insert_colony.returning[0].id,
        name: data.insert_colony.returning[0].name,
        beeCount: data.insert_colony.returning[0].beeCount,
        hiveCount: data.insert_colony.returning[0].hiveCount,
        collectionInfo: []
      } as Icolony;
      this.colonyList.push(newColony);
      this.selectedColony = newColony;
      this.insertCollectionData(newColony.id, new Date(), 0);
      this.calculateData();
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  calculateData() {
    this.calculateCollectionDate();
    this.calculateOverproduction();
    this.updateData();
  }

  private calculateCollectionDate() {
    if (this.selectedColony.collectionInfo.length === 0) {
      this.nextCollectionDate = new Date();
    } else {
      this.nextCollectionDate = new Date(this.selectedColony.collectionInfo[0].collectionDate);
      this.nextCollectionDate.setDate(this.nextCollectionDate.getDate() + 6);
    }
  }

  selectColony(event: any) {
    console.log(event);
    if (event.value === 'New Colony') {
      const colonyBeeCount = 0;
      const colonyHiveCount = 0;
      const colonyName = 'Colony ' + (this.colonyList.length + 1);
      this.insertNewColony(colonyName, colonyBeeCount, colonyHiveCount);
    }
    this.calculateData();
  }

  updateHiveCount() {
    this.selectedColony.hiveCount += 1;
    this.calculateData();
  }

  updateBeeCount(event: any) {
    this.selectedColony.beeCount = event.value;
    this.calculateData();
  }

  updateHoneyCollected(event: any) {
    this.honeyCollected = event.value;
  }

  updateHoneyCollectionDate(event: any) {
    if (new Date(event.value) > new Date()) {
      this.honeyCollectionDate = new Date();
    } else {
      this.honeyCollectionDate = event.value;
    }
  }

  collectHoney() {
    this.calculateData();
    this.honeyCollected = this.overproduction;
    if (this.honeyCollected > 0 && this.honeyCollectionDate !== undefined && this.selectedColony.hiveCount > 0) {
      const newCollection: IcollectionInfo = {
        colony_id: this.selectedColony.id,
        collectionAmount: this.honeyCollected,
        collectionDate: new Date(this.honeyCollectionDate)
      };
      this.selectedColony.collectionInfo.push(newCollection);
      this.insertCollectionData(this.selectedColony.id, new Date(this.honeyCollectionDate), this.honeyCollected);
      this.honeyCollectionDate = new Date();
      this.honeyCollected = 0;
      this.calculateData();
    }
  }

  private calculateOverproduction() {
    const differenceInTime = new Date().getTime() -
      new Date(this.selectedColony.collectionInfo[this.selectedColony.collectionInfo.length - 1].collectionDate).getTime();

    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
    this.overproduction = (this.selectedColony.beeCount / this.selectedColony.hiveCount) * differenceInDays * 0.26;

    if (this.overproduction > 150 && this.selectedColony.collectionInfo.length > 0) {
      this.isOverProduction = true;
    } else {
      this.isOverProduction = false;
    }
  }
}
