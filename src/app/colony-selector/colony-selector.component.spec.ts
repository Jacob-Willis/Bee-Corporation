import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColonySelectorComponent } from './colony-selector.component';
import { FormsModule } from '@angular/forms';
import { Apollo, ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { IcollectionInfo } from '../collection-info';


export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: 'https://bee-corporation-on-postgress.herokuapp.com/v1/graphql' }),
    cache: new InMemoryCache(),
  };
}

describe('ColonySelectorComponent', () => {
  let component: ColonySelectorComponent;
  let fixture: ComponentFixture<ColonySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColonySelectorComponent],
      imports: [FormsModule, HttpClientModule, ApolloModule, HttpLinkModule],
      providers: [{
        provide: APOLLO_OPTIONS,
        useFactory: createApollo,
        deps: [HttpLink],
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColonySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate correct next date', () => {
    component.selectedColony = {
      beeCount: 100,
      hiveCount: 1,
      id: 1,
      name: 'Colony 1',
      collectionInfo: []
    };
    component.selectedColony.collectionInfo.push({
      collectionAmount: 100,
      collectionDate: new Date(2010, 6, 10),
      colony_id: 1
    });

    component.calculateData();

    expect(component.nextCollectionDate).toEqual(new Date(2010, 6, 16));
  });

  it('should calculate correct overproduction amount', () => {
    component.selectedColony = {
      beeCount: 100,
      hiveCount: 1,
      id: 1,
      name: 'Colony 1',
      collectionInfo: []
    };
    component.selectedColony.collectionInfo.push({
      collectionAmount: 100,
      collectionDate: new Date(2010, 6, 10),
      colony_id: 1
    });

    component.calculateData();

    expect(component.overproduction).toBeGreaterThanOrEqual(89530);
    expect(component.overproduction).toBeLessThan(89531);
    expect(component.isOverProduction).toBeTruthy();
  });

  it('should calculate correct overproduction amount', () => {
    component.selectedColony = {
      beeCount: 100,
      hiveCount: 1,
      id: 1,
      name: 'Colony 1',
      collectionInfo: []
    };
    component.selectedColony.collectionInfo.push({
      collectionAmount: 100,
      collectionDate: new Date(),
      colony_id: 1
    });

    component.calculateData();

    expect(component.overproduction).toBe(0);
    expect(component.isOverProduction).toBeFalsy();
  });

  it('should update hive count', () => {
    component.selectedColony = {
      beeCount: 100,
      hiveCount: 1,
      id: 1,
      name: 'Colony 1',
      collectionInfo: []
    };
    component.selectedColony.collectionInfo.push({
      collectionAmount: 100,
      collectionDate: new Date(),
      colony_id: 1
    });

    component.updateHiveCount();

    expect(component.selectedColony.hiveCount).toBe(2);
  });

  it('should collect honey', () => {
    component.selectedColony = {
      beeCount: 100,
      hiveCount: 1,
      id: 1,
      name: 'Colony 1',
      collectionInfo: []
    };
    component.selectedColony.collectionInfo.push({
      collectionAmount: 100,
      collectionDate: new Date(2010, 6, 10),
      colony_id: 1
    });

    component.calculateData();
    const newCollection: IcollectionInfo = {
      colony_id: 1,
      collectionAmount: component.overproduction,
      collectionDate: new Date()
    };

    expect(component.selectedColony.collectionInfo.length).toBe(1);
    component.collectHoney();
    expect(component.selectedColony.collectionInfo.length).toBe(2);
    expect(component.selectedColony.collectionInfo[1].colony_id).toBe(newCollection.colony_id);
    expect(component.selectedColony.collectionInfo[1].collectionAmount).toBeCloseTo(newCollection.collectionAmount);
    expect(component.selectedColony.collectionInfo[1].collectionDate.getFullYear()).toEqual(newCollection.collectionDate.getFullYear());
    expect(component.selectedColony.collectionInfo[1].collectionDate.getMonth()).toEqual(newCollection.collectionDate.getMonth());
    expect(component.selectedColony.collectionInfo[1].collectionDate.getDay()).toEqual(newCollection.collectionDate.getDay());
  });
});
