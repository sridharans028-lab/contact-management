package com.srm.contactmanagement.controller;

import com.srm.contactmanagement.model.Contact;
import com.srm.contactmanagement.repository.ContactRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactRepository contactRepository;

    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @GetMapping
    public List<Contact> getContacts(@RequestParam(required = false) String search) {
        if (search == null || search.isBlank()) {
            return contactRepository.findAll();
        }
        return contactRepository.search(search.trim());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContact(@PathVariable Long id) {
        return contactRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Contact not found")));
    }

    @PostMapping
    public ResponseEntity<?> addContact(@RequestBody Contact contact) {
        String validationMessage = validate(contact);
        if (validationMessage != null) {
            return ResponseEntity.badRequest().body(Map.of("message", validationMessage));
        }
        contactRepository.save(clean(contact));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Contact added successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateContact(@PathVariable Long id, @RequestBody Contact contact) {
        String validationMessage = validate(contact);
        if (validationMessage != null) {
            return ResponseEntity.badRequest().body(Map.of("message", validationMessage));
        }
        int updated = contactRepository.update(id, clean(contact));
        if (updated == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Contact not found"));
        }
        return ResponseEntity.ok(Map.of("message", "Contact updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {
        int deleted = contactRepository.delete(id);
        if (deleted == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Contact not found"));
        }
        return ResponseEntity.ok(Map.of("message", "Contact deleted successfully"));
    }

    private String validate(Contact contact) {
        if (contact == null || isBlank(contact.getName()) || isBlank(contact.getPhone()) || isBlank(contact.getEmail())) {
            return "Name, phone number and email are required.";
        }
        if (contact.getName().trim().length() > 100) {
            return "Name must be 100 characters or fewer.";
        }
        if (contact.getPhone().trim().length() > 20) {
            return "Phone number must be 20 characters or fewer.";
        }
        if (contact.getEmail().trim().length() > 120 || !contact.getEmail().trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return "Enter a valid email address (maximum 120 characters).";
        }
        return null;
    }

    private Contact clean(Contact contact) {
        return new Contact(null, contact.getName().trim(), contact.getPhone().trim(), contact.getEmail().trim());
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
