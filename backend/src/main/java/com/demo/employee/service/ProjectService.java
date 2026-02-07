package com.demo.employee.service;

import com.demo.employee.dto.EmployeeDTO;
import com.demo.employee.dto.ProjectDTO;
import com.demo.employee.entity.Employee;
import com.demo.employee.entity.Project;
import com.demo.employee.entity.ProjectStatus;
import com.demo.employee.repository.EmployeeRepository;
import com.demo.employee.repository.ProjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final EmployeeRepository empRepo;

    public ProjectService(ProjectRepository projectRepo,
                          EmployeeRepository empRepo) {
        this.projectRepo = projectRepo;
        this.empRepo = empRepo;
    }

    // CREATE
    public Project save(ProjectDTO req) {
        Project p = new Project();
        mapDtoToEntity(p, req);
        return projectRepo.save(p);
    }

    // READ
    public List<Project> getAll() {
        return projectRepo.findAll();
    }

    public Project getById(Long id) {
        return projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    // DELETE
    public void delete(Long id) {
        projectRepo.deleteById(id);
    }

    // UPDATE
    public Project update(Long id, ProjectDTO req) {
        Project p = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        mapDtoToEntity(p, req);

        return projectRepo.save(p);
    }

    // COMMON MAPPER
    private void mapDtoToEntity(Project p, ProjectDTO req) {
        p.setName(req.getName());
        p.setStatus(validateStatus(req.getStatus()));
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
    }

    private ProjectStatus validateStatus(ProjectStatus status) {
        if (status == null) {
            throw new RuntimeException("Status cannot be null");
        }
        return status;
    }

    public Project assignEmployees(Long id, List<Long> ids){
        Project p = getById(id);

        List<Employee> employees =
                empRepo.findAllById(ids);

        if (employees.size() != ids.size()) {
            throw new RuntimeException("Some employees not found");
        }

        // ✅ REPLACE instead of MERGE
        p.setEmployees(new ArrayList<>(employees));

        return projectRepo.save(p);
    }

    public Page<Project> search(String key, int page, int size) {
        if (key == null || key.isBlank()) {
            return projectRepo.findAll(PageRequest.of(page, size));
        }

        return projectRepo.search(key.toLowerCase(),
                PageRequest.of(page, size));
    }
}