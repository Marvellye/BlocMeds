import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:blocmeds_qr/services/api_service.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  bool _isScanning = true;
  bool _isLoading = false;

  void _onDetect(BarcodeCapture capture) async {
    if (!_isScanning) return;
    setState(() => _isScanning = false);

    final String? rawValue =
        capture.barcodes.first.rawValue?.trim().toUpperCase();
    if (rawValue == null || rawValue.isEmpty) {
      Fluttertoast.showToast(msg: 'Invalid QR code');
      setState(() => _isScanning = true);
      return;
    }

    setState(() => _isLoading = true);
    final drugData = await ApiService.verifyBatch(rawValue);
    setState(() => _isLoading = false);

    if (drugData['verified'] == true) {
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Verified Drug'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Batch ID: ${drugData['batchId']}'),
              Text('Drug Name: ${drugData['drugName']}'),
              Text('Expiry: ${drugData['expiry']}'),
              Text('Manufacturer: ${drugData['manufacturer']}'),
              Text('Token ID: ${drugData['tokenId']}'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
    } else {
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Fake Detected'),
          content:
              Text('This drug may be fake. Batch ID: ${drugData['batchId']}'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/report', arguments: rawValue);
              },
              child: const Text('Report'),
            ),
          ],
        ),
      );
    }

    setState(() => _isScanning = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scan QR')),
      body: Stack(
        children: [
          MobileScanner(onDetect: _onDetect),
          if (_isLoading)
            const Center(
              child: SpinKitCircle(color: Colors.blue, size: 50),
            ),
        ],
      ),
    );
  }
}
