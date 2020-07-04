import { of, range, merge } from 'rxjs';
import { first, tap, map, concatAll, mergeAll, combineAll, mergeMap, switchMap, concatMap, flatMap, toArray } from 'rxjs/operators';

//
// Paginated API simulation
//
const pageSize = 5;
const getCount = () => of(18);
const getDevices = (offset = 0, pageSize = 10) => { 
  console.log(`start: ${offset * pageSize} pageSize: ${pageSize}`)
  return range(offset * pageSize, pageSize).pipe(
  map(i => of({name:`dev-${i + 1}`})),
  combineAll(),
)};

// range(5, 10).subscribe(console.log)

//
// Testing mocked API
//
//getCount().subscribe(count => console.log({count}));
// getDevices(0, 5).subscribe(r => console.log({size: r.length, devices: JSON.stringify(r)}));
//getDevices(1, 5).subscribe(r => console.log({size: r.length, devices: JSON.stringify(r)}));
// getDevices(2, 5).subscribe(r => console.log({size: r.length, devices: JSON.stringify(r)}));


//
// Query to get all the resources in parallel.
//

// Algorithm:
// 1. Get the total count of items.
// 2. Given the count and the limit, calculate how many request are needed to get all data.
// 3. Combine all data into a single array.

// Implementation: working but maybe it can be done in a better way. Without having to flatten on line 52.

getCount().pipe(
  mergeMap(count => range(0, Math.ceil(count / pageSize))),
  mergeMap(offset => getDevices(offset, pageSize)),
  mergeAll(),
  toArray()
).subscribe(res => {
  //const a = res.flat();
  //console.log(JSON.stringify(a));
  console.log(JSON.stringify(res));
});