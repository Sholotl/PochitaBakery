package service;

import model.Cake;
import model.Client;
import model.Order;
import repository.PochitaRepository;

public class PochitaBakery {

    private final PochitaRepository repository;

    public PochitaBakery(PochitaRepository repository) {
        this.repository = repository;
    }

    public Client addClient(String name, String phone) {

        if (name == null || name.isBlank() || phone == null || phone.isBlank()) 
            {throw new IllegalArgumentException("Nombre y teléfono son obligatorios.");}

        if (repository.clientExists(name.trim(), phone.trim())) 
            {throw new IllegalArgumentException("Ese cliente ya está registrado.");}

        return repository.insertClient(name.trim(), phone.trim());
    }

    public Order addOrder(int clientId, Cake cake, String deliveryDate) {
        Client client = repository.findClientById(clientId);

        if (client == null) 
            { throw new IllegalArgumentException("Ese ID no coincide con ningún cliente."); }

        if (cake.getFloors() < 1 || cake.getFloors() > 3) 
            { throw new IllegalArgumentException("Los pisos deben ser entre 1 y 3.");}

        return repository.insertOrder(client, cake, deliveryDate);
    }
}