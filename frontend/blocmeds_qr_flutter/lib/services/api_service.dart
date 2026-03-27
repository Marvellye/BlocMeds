import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static Future<Map<String, dynamic>> verifyBatch(String batchId) async {
    batchId = batchId.trim().toUpperCase();
    final url =
        'https://blocmeds-backend.onrender.com/api/drugs/verify/$batchId';
    print('Calling API: $url');

    try {
      final response = await http.get(Uri.parse(url));
      print('Status Code: ${response.statusCode}');
      print('Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);

        // No 'data' wrapper — return decoded directly
        if (decoded is Map<String, dynamic>) {
          return {
            'verified':
                true, // Add this manually since backend doesn't include it
            ...decoded,
          };
        } else {
          throw Exception('Unexpected response format');
        }
      } else if (response.statusCode == 404) {
        print('Batch not found: $batchId');
        return {
          'verified': false,
          'batchId': batchId,
          'drugName': 'Unknown',
          'expiry': 'Unknown',
          'manufacturer': 'Unknown',
          'tokenId': 'N/A',
        };
      } else {
        throw Exception('API returned status code ${response.statusCode}');
      }
    } catch (e) {
      print('API failed, using mock data: $e');
      return {
        'verified': false,
        'batchId': batchId,
        'drugName': 'Unknown',
        'expiry': 'Unknown',
        'manufacturer': 'Unknown',
        'tokenId': 'N/A',
      };
    }
  }
}
