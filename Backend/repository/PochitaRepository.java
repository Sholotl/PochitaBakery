/*
This class handles the database connection
and performs operations with orders and clients.
*/

package repository;

import model.Cake;
import model.Client;
import model.Order;

import java.sql.*;

public class PochitaRepository {
    private static final String URL = "jdbc:sqlite:data/pochita.db";

    //==== Method to get a database connection =====
    private Connection getConnection() throws SQLException 
    {
        Connection connection = DriverManager.getConnection(URL);
        connection.createStatement().execute("PRAGMA foreign_keys = ON;");
        return connection;
    }
    //===============================================================

    // Method to insert a new order into the database
    public Order insertOrder(Client client, Cake cake, String deliveryDate) 
    {
        String sql = "INSERT INTO orders (client_id, flavor, cover, toppings, shape, size, floors, delivery_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, client.getId());
            stmt.setString(2, cake.getFlavor());
            stmt.setString(3, cake.getCover());
            stmt.setString(4, cake.getToppings());
            stmt.setString(5, cake.getShape());
            stmt.setString(6, cake.getSize());
            stmt.setInt(7, cake.getFloors());
            stmt.setString(8, deliveryDate);
            stmt.executeUpdate();
            ResultSet keys = stmt.getGeneratedKeys();
            keys.next();
            return new Order(keys.getInt(1), client, cake, deliveryDate, "PENDING");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Method to insert a new client into the database
    public Client insertClient(String name, String phone) 
    {
        String sql = "INSERT INTO clients (name, phone) VALUES (?, ?)";

        try (
            Connection conn = getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) 
            {
            stmt.setString(1, name);
            stmt.setString(2, phone);
            stmt.executeUpdate();

            ResultSet keys = stmt.getGeneratedKeys();
            keys.next();

            return new Client(keys.getInt(1), name, phone);
            
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Method to check if a client already exists in the database
    public boolean clientExists(String name, String phone) 
    {
        String sql = "SELECT 1 FROM clients WHERE name = ? AND phone = ?";
        
        try (
            Connection conn = getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) 
            {
            stmt.setString(1, name);
            stmt.setString(2, phone);

            return stmt.executeQuery().next();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Method to find a client by ID in the database
    public Client findClientById(int id) 
    {
        String sql = "SELECT id, name, phone FROM clients WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Client(rs.getInt("id"), rs.getString("name"), rs.getString("phone"));
            }
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
} // end of PochitaRepository class