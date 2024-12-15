package com.smartstudenttracker.smart_student_tracker.repository;

import com.smartstudenttracker.smart_student_tracker.dto.GlobalSearchDTO;
import java.util.List;

public interface GlobalSearchRepository {
    List<GlobalSearchDTO> performGlobalSearch(String query, List<String> types);
}