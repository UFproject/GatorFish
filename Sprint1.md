# Project Status Report

### **backend video**

[link](https://drive.google.com/drive/folders/10zM5kLIs0df_ElJ2fc689G3-SYIXyB8U)

### **frontend video**

[link](https://drive.google.com/file/d/1BNDY3AhtEMG6OGNuU624KpdxZiDdEpgq/view?usp=drive_link)

### **User Stories**

#### **Story 1**

1. **User opens the website:** Backend needs to send some recommended items.
2. **User signs in:** Use cookies to store user status.
3. **User posts an item:** Send item details to the database.
4. **User visits the "posted items" page:** Backend sends posted items to the frontend.
5. **User chats with buyer:** Backend supports message sending.
6. **User receives payment and rates the buyer when the order is completed:** Ratings are stored in the database.

#### **Story 2**

1. **User opens the website:** Backend needs to send some recommended items.
2. **User searches for an item:** Backend sends items based on the search query.
3. **User opens an item:** Backend sends item details.
4. **User signs in/up:** Login authentication and storing the user account in the database. *(Option 1)*
5. **User chats with the seller:** Backend supports message sending. *(Option 2)*
6. **User buys an item, fills in address, and pays:** Creates an order in the database.
7. **User checks the shipping status:** Backend sends shipping details.
8. **User confirms the received item and rates the item and seller:** Updates order status and stores the rating in the database.

**Option 2:**

1. **User buys an item, fills in address, and pays:** Creates an order in the database.
2. **User asks for a refund:** Updates the order status.
3. **User files a complaint about the order:** Admin handles disputes.

**Option 1:**

1. **User bids on items:** Backend stores bidding information.

------

### **Issues We Planned to Address**

1. Implement user authentication and session management.
2. Develop messaging functionality between buyers and sellers.
3. Create secure payment processing and order management.
4. Enable rating and review systems.
5. Develop search functionality with filters.
6. Implement bidding and auction features.
7. Design admin panel for handling disputes.
8. Optimize database queries for faster performance.
9. Write the Navigation component.
10. Write the Product Card component.
11. Write the Login page.
12. Add the router.
13. Write the Product page.

------

### **Successfully Completed Issues**

1. **User Authentication:** Implemented secure sign-in/up with session management via cookies.
2. **Search Functionality:** Users can search for items with dynamic query filters.
3. **Navigation component**
4. **Product Card component**
5. **Login page**
6. **Add the router**
7. **Product page**


------

### **Issues Not Completed and Reasons**

1. **Bidding and Auction Features:** Development delayed due to complexity in real-time bid updates and priority shifts to core functionalities.
2. **Admin Panel for Dispute Handling:** Postponed due to limited resources and focus on finalizing buyer-seller core features.
3. **Refund Process Automation:** Partially implemented; backend logic is in place, but frontend integration is pending due to UI redesign delays.
4. **Database Optimization:** Basic optimizations done, but advanced indexing and caching strategies are still under development.

------

### **Next Steps**

1. Finalize bidding system with real-time updates.
2. Complete the admin dispute handling panel.
3. Integrate and test the refund process on the frontend.
4. Continue optimizing database performance.
5. Conduct end-to-end testing for all modules.
6. Gather user feedback for further improvements.

