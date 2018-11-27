export const INITIAL_STATE: DpState = {
  distance: 0,
}

export interface DpState {
  distance: number;
}

export function  rootReducer( state: DpState, action ): DpState {
  let mydistance;
  switch ( action.type ) {
    case 'GETDISTANCE' :
      if( action.unitMeasure === 'kilometers' && action.firstTime ){
        mydistance = action.mydistance;
      } else if ( action.unitMeasure === 'kilometers' ){
        mydistance = action.mydistance / action.constNumber ;
      } else if ( action.unitMeasure === 'miles'  ){
        mydistance = action.mydistance * action.constNumber;
      } else {
        mydistance = action.mydistance;
      }
      return { distance: mydistance }
    default:
      return state;
  }
}
