from typing import List, Dict, Optional
from domain.result import Result

class ResultService:
    """
    ResultService - zawiera logikę biznesową dla operacji na wynikach.
    To jest warstwa Use Cases - mówi CO można zrobić z danymi.
    """
    
    def __init__(self, result_repository):
        self.result_repository = result_repository

    def add_result(self, result: Result) -> Result:
        """Dodaje nowy wynik"""
        # Walidacja biznesowa
        if result.penalty_points < 0:
            raise ValueError("Punkty karne nie mogą być ujemne")
        
        if not result.team:
            raise ValueError("Nazwa zespołu jest wymagana")
        
        return self.result_repository.add(result)

    def delete_result(self, result_id: int) -> bool:
        """Usuwa wynik (soft delete)"""
        return self.result_repository.soft_delete(result_id)

    def list_results_by_event(self, event_id: int) -> Dict[str, List[Result]]:
        """Listuje wyniki dla danego wydarzenia pogrupowane według kategorii"""
        return self.result_repository.get_by_event_grouped_by_category(event_id)
    
    def get_result_by_id(self, result_id: int) -> Optional[Result]:
        """Pobiera wynik po ID"""
        return self.result_repository.get_by_id(result_id)
    
    def delete_all_results_for_event(self, event_id: int) -> bool:
        """Usuwa wszystkie wyniki dla danego wydarzenia (soft delete)"""
        return self.result_repository.delete_all_for_event(event_id) 