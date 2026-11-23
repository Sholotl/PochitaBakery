package model;
/*
This class stores the basic data of a client: id, name and phone number.
It does not know anything about cakes or orders, an order links to a client
through its id, so the client is saved only once even if it has many orders.
*/

public class Client {
    private final int id;
    private final String name;
    private final String phone;

    public Client(int id, String name, String phone) {

        this.id = id;
        this.name = name;
        this.phone = phone;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }
}
