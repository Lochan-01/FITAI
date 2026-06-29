import os
import sys
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.ai.diet_model import recommend_diet


class DietModelTests(unittest.TestCase):
    def test_recommend_diet_returns_meal_plans(self):
        result = recommend_diet(28, "M", 176, 72, "Weight Loss")

        self.assertEqual(result["goal"], "Weight Loss")
        self.assertGreater(result["estimated_daily_calories"], 0)
        self.assertEqual(len(result["meal_plans"]), 4)

        for meal_plan in result["meal_plans"]:
            self.assertIn("meal", meal_plan)
            self.assertIn("recipes", meal_plan)
            self.assertGreaterEqual(len(meal_plan["recipes"]), 1)


if __name__ == "__main__":
    unittest.main()
