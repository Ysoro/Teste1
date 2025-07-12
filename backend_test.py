#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Iridology Analysis API
Tests all endpoints and validates the complete workflow
"""

import requests
import json
import base64
import io
from PIL import Image
import sys
import traceback
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "http://localhost:8001"

class IridologyAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.user_id = None
        self.analysis_id = None
        self.report_id = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })
        
        if not success:
            print(f"   Error details: {message}")
            if response_data:
                print(f"   Response: {response_data}")
    
    def create_test_image(self):
        """Create a simple test image in base64 format"""
        # Create a simple 100x100 RGB image
        img = Image.new('RGB', (100, 100), color='blue')
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG')
        img_data = buffer.getvalue()
        return base64.b64encode(img_data).decode('utf-8')
    
    def test_health_check(self):
        """Test GET /api/health"""
        try:
            response = requests.get(f"{self.base_url}/api/health")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, "API is healthy", data)
                    return True
                else:
                    self.log_test("Health Check", False, "Unexpected health status", data)
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_create_user(self):
        """Test POST /api/users"""
        try:
            user_data = {
                "sex": "F",
                "birth_date": "1990-05-15",
                "birth_time": "14:30",
                "birth_location": "São Paulo, Brasil"
            }
            
            response = requests.post(
                f"{self.base_url}/api/users",
                json=user_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("user_id"):
                    self.user_id = data["user_id"]
                    self.log_test("Create User", True, f"User created with ID: {self.user_id}", data)
                    return True
                else:
                    self.log_test("Create User", False, "Missing success or user_id in response", data)
                    return False
            else:
                self.log_test("Create User", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Create User", False, f"Error: {str(e)}")
            return False
    
    def test_get_user(self):
        """Test GET /api/users/{user_id}"""
        if not self.user_id:
            self.log_test("Get User", False, "No user_id available from previous test")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/api/users/{self.user_id}")
            
            if response.status_code == 200:
                data = response.json()
                expected_fields = ["id", "sex", "birth_date", "birth_time", "birth_location"]
                
                if all(field in data for field in expected_fields):
                    self.log_test("Get User", True, "User profile retrieved successfully", data)
                    return True
                else:
                    missing = [f for f in expected_fields if f not in data]
                    self.log_test("Get User", False, f"Missing fields: {missing}", data)
                    return False
            else:
                self.log_test("Get User", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get User", False, f"Error: {str(e)}")
            return False
    
    def test_upload_eye_image(self):
        """Test POST /api/upload-eye-image"""
        if not self.user_id:
            self.log_test("Upload Eye Image", False, "No user_id available")
            return False
            
        try:
            # Create test image
            img = Image.new('RGB', (200, 200), color='brown')
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG')
            buffer.seek(0)
            
            files = {
                'eye_image': ('test_eye.jpg', buffer, 'image/jpeg')
            }
            data = {
                'user_id': self.user_id
            }
            
            response = requests.post(
                f"{self.base_url}/api/upload-eye-image",
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                resp_data = response.json()
                if resp_data.get("success") and resp_data.get("analysis_id"):
                    self.analysis_id = resp_data["analysis_id"]
                    self.log_test("Upload Eye Image", True, f"Image uploaded with analysis ID: {self.analysis_id}", resp_data)
                    return True
                else:
                    self.log_test("Upload Eye Image", False, "Missing success or analysis_id", resp_data)
                    return False
            else:
                self.log_test("Upload Eye Image", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Upload Eye Image", False, f"Error: {str(e)}")
            return False
    
    def test_analyze_iridology(self):
        """Test POST /api/analyze-iridology/{analysis_id}"""
        if not self.analysis_id:
            self.log_test("Analyze Iridology", False, "No analysis_id available")
            return False
            
        try:
            response = requests.post(f"{self.base_url}/api/analyze-iridology/{self.analysis_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("analysis_results"):
                    analysis_results = data["analysis_results"]
                    expected_fields = ["iris_constitution", "constitutional_weakness", "organ_zones", "recommendations"]
                    
                    if all(field in analysis_results for field in expected_fields):
                        self.log_test("Analyze Iridology", True, "Iridology analysis completed successfully", data)
                        return True
                    else:
                        missing = [f for f in expected_fields if f not in analysis_results]
                        self.log_test("Analyze Iridology", False, f"Missing analysis fields: {missing}", data)
                        return False
                else:
                    self.log_test("Analyze Iridology", False, "Missing success or analysis_results", data)
                    return False
            else:
                self.log_test("Analyze Iridology", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Analyze Iridology", False, f"Error: {str(e)}")
            return False
    
    def test_generate_astrology(self):
        """Test POST /api/generate-astrology/{user_id}"""
        if not self.user_id:
            self.log_test("Generate Astrology", False, "No user_id available")
            return False
            
        try:
            response = requests.post(f"{self.base_url}/api/generate-astrology/{self.user_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("astrology_analysis"):
                    astrology = data["astrology_analysis"]
                    expected_fields = ["sun_sign", "moon_sign", "rising_sign", "health_aspects", "health_recommendations"]
                    
                    if all(field in astrology for field in expected_fields):
                        self.log_test("Generate Astrology", True, "Astrology analysis completed successfully", data)
                        return True
                    else:
                        missing = [f for f in expected_fields if f not in astrology]
                        self.log_test("Generate Astrology", False, f"Missing astrology fields: {missing}", data)
                        return False
                else:
                    self.log_test("Generate Astrology", False, "Missing success or astrology_analysis", data)
                    return False
            else:
                self.log_test("Generate Astrology", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Generate Astrology", False, f"Error: {str(e)}")
            return False
    
    def test_generate_report(self):
        """Test POST /api/generate-report"""
        if not self.user_id or not self.analysis_id:
            self.log_test("Generate Report", False, "Missing user_id or analysis_id")
            return False
            
        try:
            data = {
                'user_id': self.user_id,
                'analysis_id': self.analysis_id
            }
            
            response = requests.post(
                f"{self.base_url}/api/generate-report",
                data=data
            )
            
            if response.status_code == 200:
                resp_data = response.json()
                if resp_data.get("success") and resp_data.get("report_id") and resp_data.get("report"):
                    self.report_id = resp_data["report_id"]
                    report = resp_data["report"]
                    expected_fields = ["id", "user_id", "analysis_id", "iridology_analysis", "astrology_analysis", "combined_insights"]
                    
                    if all(field in report for field in expected_fields):
                        self.log_test("Generate Report", True, f"Combined report generated with ID: {self.report_id}", resp_data)
                        return True
                    else:
                        missing = [f for f in expected_fields if f not in report]
                        self.log_test("Generate Report", False, f"Missing report fields: {missing}", resp_data)
                        return False
                else:
                    self.log_test("Generate Report", False, "Missing success, report_id, or report", resp_data)
                    return False
            else:
                self.log_test("Generate Report", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Generate Report", False, f"Error: {str(e)}")
            return False
    
    def test_get_report(self):
        """Test GET /api/reports/{report_id}"""
        if not self.report_id:
            self.log_test("Get Report", False, "No report_id available")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/api/reports/{self.report_id}")
            
            if response.status_code == 200:
                data = response.json()
                expected_fields = ["id", "user_id", "analysis_id", "iridology_analysis", "astrology_analysis", "combined_insights"]
                
                if all(field in data for field in expected_fields):
                    self.log_test("Get Report", True, "Report retrieved successfully", data)
                    return True
                else:
                    missing = [f for f in expected_fields if f not in data]
                    self.log_test("Get Report", False, f"Missing fields: {missing}", data)
                    return False
            else:
                self.log_test("Get Report", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get Report", False, f"Error: {str(e)}")
            return False
    
    def test_get_user_reports(self):
        """Test GET /api/reports/user/{user_id}"""
        if not self.user_id:
            self.log_test("Get User Reports", False, "No user_id available")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/api/reports/user/{self.user_id}")
            
            if response.status_code == 200:
                data = response.json()
                if "reports" in data and isinstance(data["reports"], list):
                    if len(data["reports"]) > 0:
                        # Check if our report is in the list
                        report_ids = [r.get("id") for r in data["reports"]]
                        if self.report_id in report_ids:
                            self.log_test("Get User Reports", True, f"Found {len(data['reports'])} reports for user", data)
                            return True
                        else:
                            self.log_test("Get User Reports", False, "Generated report not found in user reports", data)
                            return False
                    else:
                        self.log_test("Get User Reports", False, "No reports found for user", data)
                        return False
                else:
                    self.log_test("Get User Reports", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Get User Reports", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get User Reports", False, f"Error: {str(e)}")
            return False
    
    def test_invalid_requests(self):
        """Test error handling with invalid requests"""
        tests_passed = 0
        total_tests = 4
        
        # Test 1: Get non-existent user
        try:
            response = requests.get(f"{self.base_url}/api/users/invalid-id")
            if response.status_code == 404:
                self.log_test("Invalid User ID", True, "Correctly returned 404 for invalid user")
                tests_passed += 1
            else:
                self.log_test("Invalid User ID", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Invalid User ID", False, f"Error: {str(e)}")
        
        # Test 2: Get non-existent analysis
        try:
            response = requests.post(f"{self.base_url}/api/analyze-iridology/invalid-id")
            if response.status_code == 404:
                self.log_test("Invalid Analysis ID", True, "Correctly returned 404 for invalid analysis")
                tests_passed += 1
            else:
                self.log_test("Invalid Analysis ID", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Invalid Analysis ID", False, f"Error: {str(e)}")
        
        # Test 3: Get non-existent report
        try:
            response = requests.get(f"{self.base_url}/api/reports/invalid-id")
            if response.status_code == 404:
                self.log_test("Invalid Report ID", True, "Correctly returned 404 for invalid report")
                tests_passed += 1
            else:
                self.log_test("Invalid Report ID", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Invalid Report ID", False, f"Error: {str(e)}")
        
        # Test 4: Create user with invalid data
        try:
            invalid_user = {"sex": "X"}  # Missing required fields
            response = requests.post(
                f"{self.base_url}/api/users",
                json=invalid_user,
                headers={"Content-Type": "application/json"}
            )
            if response.status_code in [400, 422]:
                self.log_test("Invalid User Data", True, "Correctly rejected invalid user data")
                tests_passed += 1
            else:
                self.log_test("Invalid User Data", False, f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_test("Invalid User Data", False, f"Error: {str(e)}")
        
        return tests_passed == total_tests
    
    def run_all_tests(self):
        """Run complete test suite"""
        print("=" * 60)
        print("🧪 IRIDOLOGY API COMPREHENSIVE TESTING")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        # Test sequence following the complete workflow
        test_sequence = [
            ("Health Check", self.test_health_check),
            ("Create User Profile", self.test_create_user),
            ("Get User Profile", self.test_get_user),
            ("Upload Eye Image", self.test_upload_eye_image),
            ("Analyze Iridology", self.test_analyze_iridology),
            ("Generate Astrology", self.test_generate_astrology),
            ("Generate Combined Report", self.test_generate_report),
            ("Get Specific Report", self.test_get_report),
            ("Get User Reports", self.test_get_user_reports),
            ("Error Handling Tests", self.test_invalid_requests)
        ]
        
        passed_tests = 0
        total_tests = len(test_sequence)
        
        for test_name, test_func in test_sequence:
            print(f"\n🔍 Running: {test_name}")
            try:
                if test_func():
                    passed_tests += 1
            except Exception as e:
                print(f"❌ FAIL {test_name}: Unexpected error - {str(e)}")
                traceback.print_exc()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if passed_tests == total_tests:
            print("\n🎉 ALL TESTS PASSED! Backend is working correctly.")
            return True
        else:
            print(f"\n⚠️  {total_tests - passed_tests} tests failed. Check the details above.")
            return False

def main():
    """Main test execution"""
    tester = IridologyAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ Backend testing completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Backend testing found issues!")
        sys.exit(1)

if __name__ == "__main__":
    main()