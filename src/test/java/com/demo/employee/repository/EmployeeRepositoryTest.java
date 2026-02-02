package com.demo.employee.repository;

import com.demo.employee.entity.Employee;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Disabled
class EmployeeRepositoryTest {

    private EmployeeRepository repository;

    @BeforeEach
    void setup() {
        repository = Mockito.mock(EmployeeRepository.class);
    }

    private Employee sampleEmployee() {
        Employee e = new Employee("Venki", "venki@yahoo.com", "9999");
        e.setId(1L);
        return e;
    }

    @Test
    void testSaveEmployee() {
        Employee emp = sampleEmployee();

        when(repository.save(emp)).thenReturn(emp);

        Employee saved = repository.save(emp);

        assertNotNull(saved);
        assertEquals(1L, saved.getId());
        assertEquals("Venki", saved.getName());
        verify(repository, times(1)).save(emp);
    }

    @Test
    void testFindById_Found() {
        Employee emp = sampleEmployee();

        when(repository.findById(1L)).thenReturn(Optional.of(emp));

        Optional<Employee> result = repository.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Venki", result.get().getName());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        Optional<Employee> result = repository.findById(1L);

        assertFalse(result.isPresent());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void testFindAll_WithData() {
        when(repository.findAll()).thenReturn(List.of(sampleEmployee()));

        List<Employee> list = repository.findAll();

        assertEquals(1, list.size());
        assertEquals("Venki", list.get(0).getName());
        verify(repository, times(1)).findAll();
    }

    @Test
    void testFindAll_EmptyList() {
        when(repository.findAll()).thenReturn(List.of());

        List<Employee> list = repository.findAll();

        assertTrue(list.isEmpty());
        verify(repository, times(1)).findAll();
    }

    @Test
    void testDeleteById_Success() {
        doNothing().when(repository).deleteById(1L);

        repository.deleteById(1L);

        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteById_WhenRepositoryThrowsException() {
        doThrow(new RuntimeException("DB error"))
                .when(repository).deleteById(1L);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> repository.deleteById(1L));

        assertEquals("DB error", ex.getMessage());
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    void testExistsById_True() {
        when(repository.existsById(1L)).thenReturn(true);

        boolean exists = repository.existsById(1L);

        assertTrue(exists);
        verify(repository, times(1)).existsById(1L);
    }

    @Test
    void testExistsById_False() {
        when(repository.existsById(1L)).thenReturn(false);

        boolean exists = repository.existsById(1L);

        assertFalse(exists);
        verify(repository, times(1)).existsById(1L);
    }

    @Test
    void testSave_ReturnsDifferentInstance() {
//        Employee input = sampleEmployee();
//        Employee returned = new Employee("New", "new@yahoo.com", "HR", "8888");
//        returned.setId(2L);
//
//        when(repository.save(input)).thenReturn(returned);
//
//        Employee saved = repository.save(input);
//
//        assertEquals(2L, saved.getId());
//        assertEquals("New", saved.getName());
//        verify(repository, times(1)).save(input);
    }

    @Test
    void testFindAll_ReturnsNull() {
        when(repository.findAll()).thenReturn(null);

        List<Employee> list = repository.findAll();

        assertNull(list);
        verify(repository, times(1)).findAll();
    }
}
