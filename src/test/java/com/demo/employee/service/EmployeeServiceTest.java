package com.demo.employee.service;

import com.demo.employee.entity.Employee;
import com.demo.employee.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeeServiceTest {

    private EmployeeRepository repository;
    private EmployeeService service;

    @BeforeEach
    void setup() {
        repository = Mockito.mock(EmployeeRepository.class);
        service = new EmployeeService(repository);
    }

    private Employee sampleEmployee() {
        Employee e = new Employee("Venki", "venki@yahoo.com", "IT", "9999");
        e.setId(1L);
        return e;
    }

    @Test
    void testSaveEmployee() {
        Employee emp = sampleEmployee();
        when(repository.save(emp)).thenReturn(emp);

        Employee saved = service.save(emp);

        assertNotNull(saved);
        assertEquals("Venki", saved.getName());
        verify(repository, times(1)).save(emp);
    }

    @Test
    void testGetAllEmployees() {
        when(repository.findAll()).thenReturn(List.of(sampleEmployee()));

        List<Employee> list = service.getAll();

        assertEquals(1, list.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void testGetAllEmployees_EmptyList() {
        when(repository.findAll()).thenReturn(List.of());

        List<Employee> list = service.getAll();

        assertTrue(list.isEmpty());
    }

    @Test
    void testGetById_Found() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleEmployee()));

        Optional<Employee> result = service.getById(1L);

        assertTrue(result.isPresent());
        assertEquals("Venki", result.get().getName());
    }

    @Test
    void testGetById_NotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        Optional<Employee> result = service.getById(1L);

        assertFalse(result.isPresent());
    }

    @Test
    void testUpdateEmployee_Success() {
        Employee existing = sampleEmployee();
        Employee updated = new Employee("New Name", "new@yahoo.com", "HR", "8888");

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Employee result = service.update(1L, updated);

        assertEquals("New Name", result.getName());
        assertEquals("HR", result.getDepartment());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(any(Employee.class));
    }

    @Test
    void testUpdateEmployee_NotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.update(1L, sampleEmployee()));

        assertEquals("Employee not found", ex.getMessage());
    }

    @Test
    void testDeleteEmployee() {
        doNothing().when(repository).deleteById(1L);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}
