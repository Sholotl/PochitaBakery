/*
This class links a client with a cake. The price is not 
stored: getTotalPrice() asks the cake for it, so the 
total is always up to date if the cake is modified.
*/

public class Order {
    int id;
    Client client;
    Cake cake;
    String deliveryDate;
    String status;

    public Order(int id, Client client, Cake cake, String deliveryDate) {

        this.id = id;
        this.client = client;
        this.cake = cake;
        this.deliveryDate = deliveryDate;
        this.status = "PENDING";
    }
}