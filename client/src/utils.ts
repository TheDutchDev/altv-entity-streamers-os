export function fillObjectPartially( objToFill : any, newData : any ) {
    for( const key in newData ) {
        objToFill[ key ] = newData[ key ];
    }
}