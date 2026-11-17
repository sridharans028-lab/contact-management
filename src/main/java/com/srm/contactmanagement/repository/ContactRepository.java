package com.srm.contactmanagement.repository;

import com.srm.contactmanagement.model.Contact;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ContactRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Contact> contactRowMapper = (rs, rowNum) -> new Contact(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getString("phone"),
            rs.getString("email")
    );

    public ContactRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Contact> findAll() {
        String sql = "SELECT id, name, phone, email FROM contacts ORDER BY id DESC";
        return jdbcTemplate.query(sql, contactRowMapper);
    }

    public List<Contact> search(String keyword) {
        String sql = "SELECT id, name, phone, email FROM contacts "
                + "WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY id DESC";
        String pattern = "%" + keyword + "%";
        return jdbcTemplate.query(sql, contactRowMapper, pattern, pattern, pattern);
    }

    public Optional<Contact> findById(Long id) {
        String sql = "SELECT id, name, phone, email FROM contacts WHERE id = ?";
        List<Contact> results = jdbcTemplate.query(sql, contactRowMapper, id);
        return results.stream().findFirst();
    }

    public int save(Contact contact) {
        String sql = "INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, contact.getName(), contact.getPhone(), contact.getEmail());
    }

    public int update(Long id, Contact contact) {
        String sql = "UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?";
        return jdbcTemplate.update(sql, contact.getName(), contact.getPhone(), contact.getEmail(), id);
    }

    public int delete(Long id) {
        String sql = "DELETE FROM contacts WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
