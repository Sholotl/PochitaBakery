package model;
/*
This class calculates the price of a cake based on its flavor, cover, toppings,
shape, size and floors. Each attribute has its own price method, and
calculateTotalPrice() adds them all up to get the final price.
*/

public class Cake {
    private final String flavor;
    private final String cover;
    private final String toppings;
    private final String shape;
    private final String size;
    private final int floors;

    public Cake(String flavor, String cover, String toppings,
                String shape, String size, int floors) {

        this.flavor = flavor;
        this.cover = cover;
        this.toppings = toppings;
        this.shape = shape;
        this.size = size;
        this.floors = floors;
    }

    public String getFlavor() {
        return flavor;
    }

    public String getCover() {
        return cover;
    }

    public String getToppings() {
        return toppings;
    }

    public String getShape() {
        return shape;
    }

    public String getSize() {
        return size;
    }

    public int getFloors() {
        return floors;
    }

    public double calculateFlavorPrice() {
        switch (flavor) {
            case "LEMON": return 80;
            case "CHOCOLATE": return 100;
            case "STRAWBERRY": return 110;
            case "RED VELVET": return 130;
            default: return 70; // VANILLA flavor
        }
    }

    public double calculateCoverPrice() {
        switch (cover) {
            case "BUTTERCREAM": return 110;
            case "FONDANT": return 150;
            default: return 80; // WHIPPED CREAM cover
        }
    }

    public double calculateToppingsPrice() {
        switch (toppings) {
            case "SPRINKLES": return 20;
            case "FRESH FRUIT": return 80;
            case "CHOCOLATE CHIPS": return 50;
            case "COOKIES": return 60;
            default: return 0.0;
        }
    }

    public double calculateShapePrice() {
        switch (shape) {
            case "SQUARE": return 20;
            case "HEART": return 40;
            case "STAR": return 80;
            case "FLOWER": return 100;
            default: return 0.0; // ROUND shape
        }
    }

    public double calculateSizePrice() {
        switch (size) {
            case "MEDIUM": return 180;
            case "LARGE": return 280;
            case "EXTRA-LARGE": return 350;
            default: return 100; // SMALL size
        }
    }

    public double calculateFloorsPrice() {
        switch (floors) {
            case 2: return 100;
            case 3: return 200;
            default: return 0; // 1 floor
        }
    }

    public double calculateTotalPrice() {
        return calculateFlavorPrice() + calculateCoverPrice() + calculateToppingsPrice()
                + calculateShapePrice() + calculateSizePrice() + calculateFloorsPrice();
    }
}