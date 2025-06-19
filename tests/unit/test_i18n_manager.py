"""Tests for the translation manager."""

import pytest
from unittest.mock import Mock, patch

from src.project_name.i18n.manager import TranslationManager, translate
from src.project_name.i18n.config import SupportedLocale


class TestTranslationManager:
    """Test cases for TranslationManager."""
    
    @pytest.fixture
    def manager(self):
        """Create a translation manager instance."""
        return TranslationManager()
    
    def test_translate_basic(self, manager):
        """Test basic translation functionality."""
        # Mock the translation
        with patch.object(manager, '_translations') as mock_translations:
            mock_translation = Mock()
            mock_translation.gettext.return_value = "Hello"
            mock_translations.__getitem__.return_value = mock_translation
            mock_translations.__contains__.return_value = True
            
            result = manager.translate("hello", "en_GB")
            assert result == "Hello"
    
    def test_translate_with_variables(self, manager):
        """Test translation with variable substitution."""
        with patch.object(manager, '_translations') as mock_translations:
            mock_translation = Mock()
            mock_translation.gettext.return_value = "Hello {name}"
            mock_translations.__getitem__.return_value = mock_translation
            mock_translations.__contains__.return_value = True
            
            result = manager.translate("hello", "en_GB", name="John")
            assert result == "Hello John"
    
    def test_translate_fallback_locale(self, manager):
        """Test fallback to default locale."""
        with patch.object(manager, '_translations') as mock_translations:
            mock_translations.__contains__.return_value = False
            mock_translation = Mock()
            mock_translation.gettext.return_value = "Hello"
            mock_translations.__getitem__.return_value = mock_translation
            
            result = manager.translate("hello", "invalid_locale")
            assert result == "Hello"
    
    def test_format_datetime(self, manager):
        """Test datetime formatting."""
        from datetime import datetime
        dt = datetime(2024, 1, 15, 14, 30, 0)
        
        with patch('src.project_name.i18n.manager.format_datetime') as mock_format:
            mock_format.return_value = "15/01/2024 14:30"
            
            result = manager.format_datetime(dt, "en_GB")
            assert result == "15/01/2024 14:30"
    
    def test_format_currency(self, manager):
        """Test currency formatting."""
        with patch('src.project_name.i18n.manager.format_currency') as mock_format:
            mock_format.return_value = "£123.45"
            
            result = manager.format_currency(123.45, "en_GB")
            assert result == "£123.45"
    
    def test_format_number(self, manager):
        """Test number formatting."""
        with patch('src.project_name.i18n.manager.format_decimal') as mock_format:
            mock_format.return_value = "1,234.56"
            
            result = manager.format_number(1234.56, "en_GB")
            assert result == "1,234.56"


def test_translate_convenience_function():
    """Test the convenience translate function."""
    with patch('src.project_name.i18n.manager.get_translation_manager') as mock_get:
        mock_manager = Mock()
        mock_manager.translate.return_value = "Translated text"
        mock_get.return_value = mock_manager
        
        result = translate("test", "en_GB")
        assert result == "Translated text"
        mock_manager.translate.assert_called_once_with("test", "en_GB")
