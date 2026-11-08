import test from 'node:test';
import assert from 'node:assert/strict';
import {selectFeaturedEvents} from '../src/programmePresentation';
import {seedState} from '../src/platform/model';

test('curated previews use current public records in owner order without repeated filler',()=>{
 const events=seedState().events;
 assert.deepEqual(selectFeaturedEvents(events,[events[2].id,events[0].id,events[2].id]).map(e=>e.id),[events[2].id,events[0].id]);
 for(const count of [0,1,2,6])assert.equal(selectFeaturedEvents(events.slice(0,count),[]).length,Math.min(count,3));
});
test('stale and unpublished feature choices cannot become promotion links',()=>{
 const events=seedState().events;events[0].state='Archived';events[1].state='Draft';
 assert.deepEqual(selectFeaturedEvents(events,[events[0].id,'missing',events[1].id]),events.slice(2,5));
 assert.deepEqual(selectFeaturedEvents(events,[events[3].id,'missing']),[events[3]]);
});
