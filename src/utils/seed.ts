import { prisma } from "../lib/prisma";

async function seedCategory() {
  try {
    const dataC = [
      {
        name: "Digestive Health",
        description: "Relief for acid reflux, heartburn, and gastric ulcers",
      },
      {
        name: "Dermatology",
        description: "Medicated creams, acne treatments, and skin care",
      },
      {
        name: "Respiratory",
        description: "Inhalers, cough syrups, and asthma management",
      },
      {
        name: "Cardiovascular",
        description: "Heart health, blood pressure, and cholesterol meds",
      },
      {
        name: "Mental Health",
        description: "Mood stabilizers, anxiety relief, and sleep aids",
      },
      {
        name: "Oral Care",
        description: "Medicated toothpaste, mouthwash, and gum treatments",
      },
      {
        name: "Veterinary",
        description: "Medicines and health products for pets and animals",
      },
    ];

    const res = [
      {
        name: "Naphcon-A",
        brand: "Alcon",
        price: 180,
        stock: 50,
        description:
          "Eye drops for rapid relief from redness and itching caused by allergies.",
        image: "https://images.example.com/naphcon.jpg",
        dosage: "15ml",
        expiryDate: "2027-05-20T00:00:00.000Z",
        categoryId: "f68cfb86-9e62-45a0-95f7-5a926d6f7c18",
        sellerId: "jVU5kUENUBaogXaHGhPSbJ7EMPzF5o0e",
      },
      {
        name: "V-Gel",
        brand: "Himalaya",
        price: 95,
        stock: 120,
        description: "Herbal gel for maintaining vaginal health and hygiene.",
        image: "https://images.example.com/vgel.jpg",
        dosage: "30g",
        expiryDate: "2026-11-10T00:00:00.000Z",
        categoryId: "14fafe70-6a1c-4719-82e2-12718556afc4",
        sellerId: "jVU5kUENUBaogXaHGhPSbJ7EMPzF5o0e",
      },
      {
        name: "M7 Blood Pressure Monitor",
        brand: "Omron",
        price: 4500,
        stock: 15,
        description:
          "Automatic upper arm blood pressure monitor with Bluetooth connectivity.",
        image: "https://images.example.com/omron-bp.jpg",
        dosage: "Unit",
        expiryDate: "2030-01-01T00:00:00.000Z",
        categoryId: "1bd90dd9-11b8-4a01-ba44-b933319006d9",
        sellerId: "jVU5kUENUBaogXaHGhPSbJ7EMPzF5o0e",
      },
      {
        name: "Zimax",
        brand: "Incepta",
        price: 350,
        stock: 100,
        description:
          "Azithromycin for bacterial infections in respiratory and soft tissues.",
        image: "https://images.example.com/zimax.jpg",
        dosage: "500mg",
        expiryDate: "2027-06-15T00:00:00.000Z",
        categoryId: "0eb69056-966b-4148-8db8-8832105fd4f5",
        sellerId: "jVU5kUENUBaogXaHGhPSbJ7EMPzF5o0e",
      },
      {
        name: "Adryl",
        brand: "Square",
        price: 60,
        stock: 200,
        description: "Diphenhydramine syrup for cough and allergy relief.",
        image: "https://images.example.com/adryl.jpg",
        dosage: "100ml",
        expiryDate: "2027-08-12T00:00:00.000Z",
        categoryId: "ca7a86ef-89ba-482a-a25a-727024ad3621",
        sellerId: "jVU5kUENUBaogXaHGhPSbJ7EMPzF5o0e",
      },
      {
        name: "Infant Paracetamol",
        brand: "Beximco",
        price: 35,
        stock: 150,
        description:
          "Gentle pain and fever relief drops formulated for infants.",
        image: "https://images.example.com/baby-napa.jpg",
        dosage: "15ml",
        expiryDate: "2026-12-01T00:00:00.000Z",
        categoryId: "9b2a66d2-593b-420d-bafd-9ee121b4065d",
        sellerId: "jVU5kUENUBaogXaHGhPSbJ7EMPzF5o0e",
      },
      {
        name: "Micropore Tape",
        brand: "3M",
        price: 85,
        stock: 300,
        description: "Hypoallergenic paper tape for securing dressings.",
        image: "https://images.example.com/3m-tape.jpg",
        dosage: "1 inch",
        expiryDate: "2029-01-01T00:00:00.000Z",
        categoryId: "2f7f80a4-0d76-440d-ae93-c5391a278883",
        sellerId: "jVU5kUENUBaogXaHGhPSbJ7EMPzF5o0e",
      },
    ];

    const resC = await prisma.category.createMany({ data: dataC });
    console.log(resC);
  } catch (error) {
    console.log(error);
  }
}

seedCategory();
