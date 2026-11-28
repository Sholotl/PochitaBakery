package model;
/*
This class links a client with a cake. The price is not 
stored: getTotalPrice() asks the cake for it, so the 
total is always up to date if the cake is modified.
*/

public class Order {
    private final int id;
    private final Client client;
    private final Cake cake;
    private final String deliveryDate;
    private String status;

    public Order(int id, Client client, Cake cake, String deliveryDate, String status) {

        this.id = id;
        this.client = client;
        this.cake = cake;
        this.deliveryDate = deliveryDate;
        this.status = status;
    }
    
    public double getTotalPrice() {
        return cake.calculateTotalPrice();
    }

    public int getId() {
        return id;
    }

    public Client getClient() {
        return client;
    }

    public Cake getCake() {
        return cake;
    }

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}