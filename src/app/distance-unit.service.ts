import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class DistanceUnitService {
    private subject = new Subject<any>();
    private pointA = new Subject<any>();
    private pointB = new Subject<any>();
    private noMessage  = new Subject<any>();


    sendMessage( message : string ) {
        this.subject.next( { text: message } );
    }

    getMessage() : Observable<any> {
        return this.subject.asObservable();
    }

    sendPointA( ptA : string  ) {
        this.pointA.next( { text: ptA } );
    }

    getPointA() : Observable<any> {
        return this.pointA.asObservable();
    }

    sendPointB( ptB : string ) {
        this.pointB.next( { text: ptB } );
    }

    getPointB() : Observable<any> {
        return this.pointB.asObservable();
    }

    setClearMessage( msg : string ){
      this.noMessage.next( { text: '' } );
    }

    getClearedAddress() : Observable<any> {
      return  this.noMessage.asObservable();
    }
}
