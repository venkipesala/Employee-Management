package com.demo.employee.controller;

import com.demo.employee.dto.ProjectDTO;
import com.demo.employee.entity.Project;
import com.demo.employee.service.ProjectService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    public Project create(@RequestBody ProjectDTO req) {
        return service.save(req);
    }

    @GetMapping
    public Page<Project> search(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return service.search(search, page, size);
    }


    @GetMapping("/{id}")
    public Project getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id,
                          @RequestBody ProjectDTO req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}/employees")
    public Project assignEmployees(
            @PathVariable Long id,
            @RequestBody List<Long> empIds){

        return service.assignEmployees(id, empIds);
    }

}
