Event Page - Loading data
1. Url containing event id is requested
2. Event with the given id is downloaded
3. Event (Member)DateRanges, in UTC time, are converted to the users timezone
4. DateRanges are accessed by the calendar 
5. (Member)RangeBoxes are created out of the DateRanges based on the dates that are shown
6. RangeBoxes are displayed on the calendar

Event Page - Updating data
1. User selects a subset of the rows in an available period
2. Selected rows are converted into (Member)RangeBoxes
3. RangeBoxes are converted into (Member)DateRanges, set in the users local timezone
4. DateRanges, in the users local timezone, are converted to UTC time
5. DateRanges are combined with the other DateRanges of the event
6. Request is sent to update the events DateRanges






















<!-- Yesterday:
[x] Create or access event member on "Confirm" 
[ ] Start building the display for event dateRanges

Today:
[ ] Allow user store their own date ranges.
[ ] Show date ranges selected for the event.
[ ] Add select full day
[ ] Add min-max time
[x] Add clear button -->
