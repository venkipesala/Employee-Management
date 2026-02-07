package com.demo.employee.controller;

import com.demo.employee.entity.Employee;
import com.demo.employee.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Disabled
class EmployeeControllerTest {

    private MockMvc mockMvc;
    private EmployeeService service;

    @BeforeEach
    void setup() {
        service = Mockito.mock(EmployeeService.class);
        //EmployeeController controller = new EmployeeController(service);
       // mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    private String employeeJson() {
        return """
               {
                 "name": "Venki",
                 "email": "venki@yahoo.com",
                 "department": "IT",
                 "phone": "9999"
               }
               """;
    }

    @Test
    void testCreateEmployee() throws Exception {
        //Employee emp = new Employee("Venki", "venki@yahoo.com", "IT", "9999");
        //emp.setId(1L);

        //when(service.save(any(Employee.class))).thenReturn(emp);

        //mockMvc.perform(post("/api/employees")
          //              .contentType(MediaType.APPLICATION_JSON)
            //            .content(employeeJson()))
              //  .andExpect(status().isOk());
    }

    @Test
    void testGetAllEmployees() throws Exception {
        //when(service.getAll()).thenReturn(List.of(new Employee()));

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetById_Found() throws Exception {
        //when(service.getById(1L)).thenReturn(Optional.of(new Employee()));

        //mockMvc.perform(get("/api/employees/1"))
          //      .andExpect(status().isOk());
    }

    @Test
    void testUpdateEmployee() throws Exception {
        //when(service.update(eq(1L), any(Employee.class))).thenReturn(new Employee());

        mockMvc.perform(put("/api/employees/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employeeJson()))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteEmployee() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isOk());
    }
}
