from sqlalchemy.orm import Session
from infrastructure.db_models import ResultModel
from domain.result import Result
from typing import List, Dict, Optional

class SqlAlchemyResultRepository:
    """
    ResultRepository - komunikuje się z bazą danych.
    To jest warstwa Repository - mówi JAK zapisujemy dane.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def add(self, result: Result) -> Result:
        """Dodaje nowy wynik do bazy danych"""
        db_result = ResultModel(
            event_id=result.event_id,
            category=result.category,
            team=result.team,
            penalty_points=result.penalty_points,
        )
        self.db.add(db_result)
        self.db.commit()
        self.db.refresh(db_result)
        
        # Konwertuj z powrotem na domain object
        return self._to_domain(db_result)

    def soft_delete(self, result_id: int) -> bool:
        """Usuwa wynik (soft delete)"""
        result = self.db.query(ResultModel).filter(ResultModel.id == result_id).first()
        if result:
            result.deleted = True
            self.db.commit()
            return True
        return False

    def get_by_event_grouped_by_category(self, event_id: int) -> Dict[str, List[Result]]:
        """Pobiera wyniki dla danego wydarzenia pogrupowane według kategorii"""
        results = self.db.query(ResultModel).filter(
            ResultModel.event_id == event_id,
            ResultModel.deleted == False
        ).order_by(ResultModel.created_at.desc()).all()
        
        # Grupuj według kategorii
        grouped_results = {}
        for result in results:
            category = result.category
            if category not in grouped_results:
                grouped_results[category] = []
            grouped_results[category].append(self._to_domain(result))
        
        return grouped_results
    
    def get_by_id(self, result_id: int) -> Optional[Result]:
        """Pobiera wynik po ID"""
        result = self.db.query(ResultModel).filter(ResultModel.id == result_id, ResultModel.deleted == False).first()
        return self._to_domain(result) if result else None
    
    def delete_all_for_event(self, event_id: int) -> bool:
        """Usuwa wszystkie wyniki dla danego wydarzenia (soft delete)"""
        results = self.db.query(ResultModel).filter(
            ResultModel.event_id == event_id,
            ResultModel.deleted == False
        ).all()
        
        for result in results:
            result.deleted = True
        
        self.db.commit()
        return True
    
    def _to_domain(self, db_result: ResultModel) -> Result:
        """Konwertuje model bazy danych na domain object"""
        return Result(
            id=db_result.id,
            event_id=db_result.event_id,
            category=db_result.category,
            team=db_result.team,
            penalty_points=db_result.penalty_points,
            deleted=db_result.deleted
        ) 