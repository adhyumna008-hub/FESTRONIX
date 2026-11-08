import test from 'node:test';
import assert from 'node:assert/strict';
import {getFluxTracks} from '../src/fluxProgramme';

test('empty and single-event Flux programmes need no seeded categories',()=>{
 assert.deepEqual(getFluxTracks([]),[]);
 assert.deepEqual(getFluxTracks([{category:'Space Systems'}]),[{name:'Space Systems',count:1}]);
});

test('Flux tracks support many unrelated categories in first appearance order',()=>{
 const names=['Product Design','Space Systems','Sustainable Engineering','Data Storytelling','Hardware Security','Scientific Computing','Assistive Technology'];
 const events=names.map(category=>({category}));
 assert.deepEqual(getFluxTracks(events),names.map(name=>({name,count:1})));
 assert.equal(getFluxTracks(events).reduce((total,track)=>total+track.count,0),events.length);
});

test('track summaries trim and merge case variants without changing source events',()=>{
 const events=[{category:' Space Systems '},{category:'Data Storytelling'},{category:'space systems'},{category:'SPACE SYSTEMS'}];
 const before=structuredClone(events);
 assert.deepEqual(getFluxTracks(events),[{name:'Space Systems',count:3},{name:'Data Storytelling',count:1}]);
 assert.deepEqual(events,before);
});

test('blank categories receive one honest fallback instead of fabricated track names',()=>{
 assert.deepEqual(getFluxTracks([{category:''},{category:'   '},{category:'Other Events'},{category:'Research'}]),[{name:'Other events',count:3},{name:'Research',count:1}]);
});
