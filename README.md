# Bus Booking System

## What the app needs:
1. Authentication
2. Stability and Error handling
3. Database
4. User roles (admin and user)
5. Testing
6. Documentation
7. OOP concepts implemented

## Front end Planning
### UI Mockups
- Home Page and Dashboard
  - ![image](https://github.com/AbhiK002/bus-booking-system/assets/68178267/8f821733-681a-4481-a1dd-d3cc2b45c7e9)

- Admin Dashboard
  - ![image](https://github.com/AbhiK002/bus-booking-system/assets/68178267/b001cee9-a153-4b98-9efc-1c430d7c771c)

- Seat Booking Page
  - ![image](https://github.com/AbhiK002/bus-booking-system/assets/68178267/42f07e96-7f03-4dde-bf8c-4229dfc1fa62)

## Database Design
- **User**
  - Name (String)
  - Email (String)
  - Password (String)
  - Admin (Boolean)
  - Location (String id)
- **Bus**
  - Name (String)
  - Description (String) optional
  - Number of seats (Number)
  - Seats occupied (Number)
  - Days of operation (List of 7 Numbers - 0 or 1)
  - From (String id Location)
  - To (String id Location)
  - Departure (Time)
  - Arrival (Time)
  - Seating Plan (Matrix of seat numbers and null values)
- **Seat**
  - Seat Number (String)
  - Price (Number)
  - Bus (String id Bus)
  - Available (Boolean)
- **Booking**
  - Booked by (String id User)
  - Amount (Number)
  - Bus (String id Bus)
  - Seat Number (String Seat number)
  - Booked on (DateTime)
- **Location**
  - Name (String)
  - Description (String) optional
  - Distances (Nested List of String id Location and Number)

## API Design
1. **get-locations**
   - Retrieves all the locations present in the database
   - Caches the locations and their distances to other locations in the API itself, so this endpoint will avoid database calls most of the times
   - Called when the user:
     - Opens the website
2. **get-buses**
   - Retrieves all the buses for a logged out user or a user without their location saved.
   - Retrieves all the buses going from a particular location, if “from” field in the request body has a location’s _id
   - Retrieves all the buses going to/from particular locations if both “from” and “to” fields have some locations’ _id
   - For each bus, only these details are fetched for a thumbnail preview
     - Name
     - Description
     - Number of seats
     - Days of Operation
     - Seats occupied (not accurate sometimes, to avoid extra requests)
     - From
     - To
     - Departure
     - Arrival
   - Called when the user:
     - Opens the website
     - Searches for buses with a criteria
3. **register**
   - Adds a new user with the details:
     - Name
     - Email
     - Password (hashed)
     - Admin = false
     - Location
   - Generates a token that can uniquely identify a logged in user
   - Called when the user:
     - Registers themselves
4. **login**
   - Checks if the user’s entered credentials match with any user in the database:
     - If true, then return a token that can uniquely identify the user
     - Otherwise, return a failed response without a token
   - Called when the user:
     - Attempts to log in to the website using their credentials
5. **autologin**
   - Checks if the given token is:
     - Valid and not expired
     - Of a user that exists in the database
   - If checks succeed, return a response with the user details similar to a successful login
     - If they fail, prompt the user to log in again, as the previous login has expired
   - Called when the user:
     - Opens the website
6. **get-bus-details**
   - Retrieves remaining details for any specified bus
     - Seating plan + Detail of each Seat [cached]
   - Called when the user:
     - Previews a bus from the homepage/search results
7. **confirm-booking**
   - Checks if the given seat (using the id) for the given bus is already booked, to reduce concurrency issues
   - If it is free, it then checks the Bookings table for any bookings made by another user for the same seat id. If it is free, only then it:
     - Creates a new booking in the Bookings table for a logged in user and a seat number
     - Updates the field “Seats booked” for the bus involved
     - Updates the field “Available” for the seat involved
   - For all the other cases, returns a failed response of “Seat is already booked by another user”
   - Called when the user:
     - Clicks on “Book” and pays the amount successfully (dummy payment via razorpay api)
8. **delete-booking**
   - Opposite effects to “/confirm-booking”
   - Called when the user:
     - Cancels their booking from their profile using “Cancel Booking” button under any of their bookings
9. **get-user-details**
   - Fetches all the information about the logged in user
   - Fetches all the bookings done by the user
   - Fetches the seat details from the bookings
   - Called when the user:
     - Is logged in and views their profile

### ADMIN ENDPOINTS
For all the admin endpoints, the first thing that will be checked is if the user authorizing these actions is a valid admin or not. This will be done by performing a search on the Users database for the user id extracted from user’s token and checking its boolean “admin” field. If not an admin, a “403 Unauthorized” response will be sent. This has been done to ensure no power user can pose themselves as an admin by sending a manually altered request to the API.

10. **add-bus**
    - Adds a new bus with the given details:
      - Name
      - Description
      - Days of operation
      - From
      - To
      - Departure
      - Arrival
      - Seating Plan
    - The seating plan will be a matrix of Strings, each string will either be a unique seat number, or “null”.
    - Adds new seats to the Seats table for every seat number given in the matrix. The id of the newly created bus will be used for the “bus” field of each Seat.
    - Called when:
      - An admin adds a bus from the admin dashboard
11. **delete-bus**
    - Deletes the bus having a particular id
    - Called when:
      - An admin deletes a bus from the admin dashboard
12. **edit-bus**
    - Similar to add-bus, the details will be changed and the procedure for the seats will be the same
    - Called when:
      - An admin edits a bus’s details from the admin dashboard

## Project Status
1. All required endpoints of API completed and implemented ✅
2. Backend part complete ✅
3. Database implemented and tested ✅
4. Frontend partially done with minimal styling
5. Only user authentication in working condition, rest no connection done between the frontend and the backend
6. No admin dashboard implemented, as a good admin dashboard takes a lot of time to implement, which was my plan here.

## Next Steps
- Complete frontend implementation
- Implement connection between frontend and backend
- Implement admin dashboard

#### Due to the shortage of time, I could not complete everything in this exciting project. My target was to implement a robust and modern admin dashboard that would look exactly like the UI mockups. However I wasn't fast enough.
This is my submission for the case study/assignment. Thank you for the opportunity.
