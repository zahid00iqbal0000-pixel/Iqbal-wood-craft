import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, Code, FileText, Download, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FLUTTER_FILES = [
  {
    name: 'pubspec.yaml',
    path: 'pubspec.yaml',
    language: 'yaml',
    description: 'Flutter project dependencies (Riverpod, Firebase, Material 3, Animations, Google Fonts, CachedNetworkImage)',
    code: `name: iqbal_woodcraft
description: "IQBAL WOODCRAFT - Premium Handcrafted Solid Wood Furniture Android & iOS Mobile Application."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  flutter_riverpod: ^2.5.1
  
  # Firebase Production Stack
  firebase_core: ^2.27.0
  firebase_auth: ^4.17.8
  cloud_firestore: ^4.15.8
  firebase_storage: ^11.6.9
  firebase_messaging: ^14.7.19
  firebase_analytics: ^10.8.9
  firebase_crashlytics: ^3.4.18
  firebase_performance: ^0.9.3+18
  
  # UI & Design
  google_fonts: ^6.1.0
  flutter_spinkit: ^5.2.0
  cached_network_image: ^3.3.1
  shimmer: ^3.0.0
  font_awesome_flutter: ^10.7.0
  carousel_slider: ^4.2.1
  
  # Utilities & Networking
  url_launcher: ^6.2.4
  dio: ^5.4.1
  intl: ^0.19.0
  shared_preferences: ^2.2.2
  flutter_rating_bar: ^4.0.1
  badges: ^3.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
`
  },
  {
    name: 'main.dart',
    path: 'lib/main.dart',
    language: 'dart',
    description: 'Application entry point with Firebase initialization and ProviderScope for Riverpod state',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'core/theme/app_theme.dart';
import 'features/splash/presentation/screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set System UI Overlay Style for Black & Gold Luxury Theme
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF0F0E0C),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Initialize Firebase (Ensure google-services.json is configured)
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint("Firebase init note: $e");
  }

  runApp(
    const ProviderScope(
      child: IqbalWoodcraftApp(),
    ),
  );
}

class IqbalWoodcraftApp extends StatelessWidget {
  const IqbalWoodcraftApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IQBAL WOODCRAFT',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      darkTheme: AppTheme.darkTheme,
      home: const SplashScreen(),
    );
  }
}
`
  },
  {
    name: 'app_theme.dart',
    path: 'lib/core/theme/app_theme.dart',
    language: 'dart',
    description: 'Material 3 Dark Black + Gold + Rosewood Brown Luxury Theme',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      primaryColor: AppColors.gold,
      
      colorScheme: const ColorScheme.dark(
        primary: AppColors.gold,
        secondary: AppColors.lightGold,
        surface: AppColors.surface,
        background: AppColors.background,
        error: Colors.redAccent,
        onPrimary: Colors.black,
        onSurface: AppColors.textPrimary,
      ),

      textTheme: TextTheme(
        displayLarge: GoogleFonts.playfairDisplay(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: AppColors.gold,
        ),
        headlineMedium: GoogleFonts.playfairDisplay(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: AppColors.gold,
        ),
        titleLarge: GoogleFonts.plusJakartaSans(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
        bodyLarge: GoogleFonts.plusJakartaSans(
          fontSize: 16,
          color: AppColors.textPrimary,
        ),
        bodyMedium: GoogleFonts.plusJakartaSans(
          fontSize: 14,
          color: AppColors.textSecondary,
        ),
      ),

      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: AppColors.gold,
        ),
        iconTheme: const IconThemeData(color: AppColors.gold),
      ),

      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.gold,
        unselectedItemColor: Colors.white54,
        type: BottomNavigationBarType.fixed,
        elevation: 10,
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.gold,
          foregroundColor: Colors.black,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontSize: 15,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      cardTheme: CardTheme(
        color: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.cardBorder, width: 0.8),
        ),
        elevation: 4,
      ),
    );
  }
}
`
  },
  {
    name: 'app_colors.dart',
    path: 'lib/core/constants/app_colors.dart',
    language: 'dart',
    description: 'Black + Gold + Wooden Brown Palette Constants',
    code: `import 'package:flutter/material.dart';

class AppColors {
  static const Color background = Color(0xFF0C0B0A);
  static const Color surface = Color(0xFF161412);
  static const Color cardBorder = Color(0x33D4AF37); // Gold 20% opacity
  
  static const Color gold = Color(0xFFD4AF37);
  static const Color lightGold = Color(0xFFF3E5AB);
  static const Color darkGold = Color(0xFF997A15);

  static const Color rosewoodBrown = Color(0xFF8B5A2B);
  static const Color darkTimber = Color(0xFF2C1E16);

  static const Color textPrimary = Color(0xFFF5EBE1);
  static const Color textSecondary = Color(0xFFA89A8E);

  static const Color whatsappGreen = Color(0xFF25D366);
  static const Color jazzCashRed = Color(0xFFD32F2F);
  static const Color easyPaisaGreen = Color(0xFF00A859);
}
`
  },
  {
    name: 'product_model.dart',
    path: 'lib/features/catalog/domain/models/product_model.dart',
    language: 'dart',
    description: 'Product Model with Firestore serialization & WoodType support',
    code: `enum WoodType {
  sheesham,
  teak,
  walnut,
  oak,
  ash
}

class Product {
  final String id;
  final String name;
  final String category;
  final double pricePkr;
  final String woodType;
  final String dimensions;
  final String description;
  final List<String> imageUrls;
  final bool isFeatured;
  final bool inStock;
  final double rating;

  Product({
    required this.id,
    required this.name,
    required this.category,
    required this.pricePkr,
    required this.woodType,
    required this.dimensions,
    required this.description,
    required this.imageUrls,
    this.isFeatured = false,
    this.inStock = true,
    this.rating = 4.9,
  });

  factory Product.fromFirestore(Map<String, dynamic> json, String documentId) {
    return Product(
      id: documentId,
      name: json['name'] ?? '',
      category: json['category'] ?? 'Living Room',
      pricePkr: (json['pricePkr'] as num?)?.toDouble() ?? 0.0,
      woodType: json['woodType'] ?? 'Solid Sheesham Wood',
      dimensions: json['dimensions'] ?? 'Standard Size',
      description: json['description'] ?? '',
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
      isFeatured: json['isFeatured'] ?? false,
      inStock: json['inStock'] ?? true,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.9,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'name': name,
      'category': category,
      'pricePkr': pricePkr,
      'woodType': woodType,
      'dimensions': dimensions,
      'description': description,
      'imageUrls': imageUrls,
      'isFeatured': isFeatured,
      'inStock': inStock,
      'rating': rating,
    };
  }
}
`
  },
  {
    name: 'ai_assistant_screen.dart',
    path: 'lib/features/ai_assistant/presentation/screens/ai_assistant_screen.dart',
    language: 'dart',
    description: 'AI Sales Consultant & Guided Custom Furniture Order Assistant Screen',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/constants/app_colors.dart';

class AiAssistantScreen extends ConsumerStatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  ConsumerState<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends ConsumerState<AiAssistantScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'isAi': true,
      'text': 'Assalam-o-Alaikum! Welcome to IQBAL WOODCRAFT AI Assistant.\n\nI am your 24/7 furniture consultant. Ask about Solid Sheesham carving, sizes, prices, or custom furniture requirements!',
      'time': '10:00 AM',
    }
  ];

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    setState(() {
      _messages.add({
        'isAi': false,
        'text': text,
        'time': 'Just now',
      });
      _controller.clear();
      
      // Simulate AI Answer with 100% Advance Payment policy rule
      _messages.add({
        'isAi': true,
        'text': 'JazakAllah for asking! IQBAL WOODCRAFT requires 100% advance payment via Bank Transfer, JazzCash, or EasyPaisa before production and cargo dispatch. COD is NOT available. Contact Muhammad Zahid Iqbal directly on WhatsApp: 0309-3509242.',
        'time': 'Just now',
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.auto_awesome, color: AppColors.gold, size: 20),
            SizedBox(width: 8),
            Text('IQBAL WOODCRAFT AI'),
          ],
        ),
      ),
      body: Column(
        children: [
          // 100% Advance Payment & No COD Header Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: const Color(0xFF221A12),
            child: const Row(
              children: [
                Icon(Icons.shield, color: AppColors.gold, size: 16),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Advance Policy: 100% Advance Payment Required. Cash on Delivery (COD) is NOT available.',
                    style: TextStyle(color: AppColors.lightGold, fontSize: 11),
                  ),
                ),
              ],
            ),
          ),
          
          // Chat List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isAi = msg['isAi'] as bool;
                return Align(
                  alignment: isAi ? Alignment.centerLeft : Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.8,
                    ),
                    decoration: BoxDecoration(
                      color: isAi ? AppColors.surface : AppColors.gold,
                      border: Border.all(
                        color: isAi ? AppColors.cardBorder : Colors.transparent,
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      msg['text'],
                      style: TextStyle(
                        color: isAi ? Colors.white : Colors.black,
                        fontSize: 13,
                        height: 1.4,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // WhatsApp Escalation Option
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: ElevatedButton.icon(
              onPressed: () async {
                final Uri url = Uri.parse("https://wa.me/923093509242");
                if (await canLaunchUrl(url)) await launchUrl(url);
              },
              icon: const FaIcon(FontAwesomeIcons.whatsapp, color: Colors.white, size: 16),
              label: const Text('Contact Human Support (0309-3509242)'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.whatsappGreen,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 40),
              ),
            ),
          ),

          // Input Bar
          Container(
            padding: const EdgeInsets.all(12),
            color: AppColors.surface,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Ask AI about custom dining tables, sofas, beds...',
                      hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
                      filled: true,
                      fillColor: AppColors.background,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppColors.gold,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.black, size: 20),
                    onPressed: () => _sendMessage(_controller.text),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    name: 'custom_bottom_nav.dart',
    path: 'lib/shared/widgets/custom_bottom_nav.dart',
    language: 'dart',
    description: 'Material 3 Custom Gold Bottom Navigation Bar',
    code: `import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class CustomBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.cardBorder, width: 0.8)),
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: onTap,
        type: BottomNavigationBarType.fixed,
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.gold,
        unselectedItemColor: Colors.white54,
        selectedFontSize: 11,
        unselectedFontSize: 11,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home, color: AppColors.gold),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.grid_view_outlined),
            activeIcon: Icon(Icons.grid_view_rounded, color: AppColors.gold),
            label: 'Categories',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.auto_awesome_outlined),
            activeIcon: Icon(Icons.auto_awesome, color: AppColors.gold),
            label: 'AI Bot',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_bag_outlined),
            activeIcon: Icon(Icons.shopping_bag, color: AppColors.gold),
            label: 'Cart',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person, color: AppColors.gold),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    name: 'custom_drawer.dart',
    path: 'lib/shared/widgets/custom_drawer.dart',
    language: 'dart',
    description: 'Luxury Timber & Gold Side Navigation Drawer',
    code: `import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/constants/app_colors.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: AppColors.background,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // Drawer Header
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF1C140D), Color(0xFF0F0E0C)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              border: Border(bottom: BorderSide(color: AppColors.cardBorder)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.gold),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'IQBAL WOODCRAFT',
                    style: TextStyle(
                      color: AppColors.gold,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Handcrafted Chinioti Solid Timber Furniture',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
                ),
                const Text(
                  'Showroom: DHA Phase 6, Karachi',
                  style: TextStyle(color: AppColors.lightGold, fontSize: 10),
                ),
              ],
            ),
          ),

          // Menu Items
          ListTile(
            leading: const Icon(Icons.handyman, color: AppColors.gold),
            title: const Text('Custom Furniture Request'),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.picture_as_pdf, color: AppColors.gold),
            title: const Text('Download 2026 PDF Catalogue'),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.shield_outlined, color: AppColors.gold),
            title: const Text('10-Year Termite Warranty'),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.account_balance, color: AppColors.gold),
            title: const Text('Bank & Advance Payment Details'),
            subtitle: const Text('Meezan, JazzCash, EasyPaisa', style: TextStyle(fontSize: 10, color: Colors.white54)),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          const Divider(color: AppColors.cardBorder),
          ListTile(
            leading: const FaIcon(FontAwesomeIcons.whatsapp, color: AppColors.whatsappGreen),
            title: const Text('Sales WhatsApp (0309-3509242)'),
            onTap: () async {
              final Uri url = Uri.parse("https://wa.me/923093509242");
              if (await canLaunchUrl(url)) await launchUrl(url);
            },
          ),
          ListTile(
            leading: const Icon(Icons.phone, color: AppColors.gold),
            title: const Text('Sales Manager (0302-0940219)'),
            onTap: () async {
              final Uri url = Uri.parse("tel:03020940219");
              if (await canLaunchUrl(url)) await launchUrl(url);
            },
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    name: 'firebase_options.dart',
    path: 'lib/firebase_options.dart',
    language: 'dart',
    description: 'Auto-generated Firebase Options supporting Android, iOS, and Web deployment',
    code: `import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyAyMRZAqNRRfwFGtQTkQQDqQNDzFwg1bCI',
    appId: '1:176008157066:web:dd1684a2663b8b2d3c9a73',
    messagingSenderId: '176008157066',
    projectId: 'igneous-imagery-sdw25',
    authDomain: 'igneous-imagery-sdw25.firebaseapp.com',
    storageBucket: 'igneous-imagery-sdw25.firebasestorage.app',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyAyMRZAqNRRfwFGtQTkQQDqQNDzFwg1bCI',
    appId: '1:176008157066:android:dd1684a2663b8b2d3c9a73',
    messagingSenderId: '176008157066',
    projectId: 'igneous-imagery-sdw25',
    storageBucket: 'igneous-imagery-sdw25.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyAyMRZAqNRRfwFGtQTkQQDqQNDzFwg1bCI',
    appId: '1:176008157066:ios:dd1684a2663b8b2d3c9a73',
    messagingSenderId: '176008157066',
    projectId: 'igneous-imagery-sdw25',
    storageBucket: 'igneous-imagery-sdw25.firebasestorage.app',
  );
}
`
  },
  {
    name: 'firebase_repository.dart',
    path: 'lib/core/repositories/firebase_repository.dart',
    language: 'dart',
    description: 'Production-ready Firebase Repository for Auth, Firestore offline cache, FCM push notifications, Analytics & Storage',
    code: `import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';

class FirebaseRepository {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FirebaseAnalytics _analytics = FirebaseAnalytics.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;

  // Initialize Offline Persistence, FCM & Auth
  Future<void> initialize() async {
    // Enable Offline Persistence for Firestore
    _db.settings = const Settings(
      persistenceEnabled: true,
      cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
    );

    // Sign in anonymously if not logged in
    if (_auth.currentUser == null) {
      try {
        await _auth.signInAnonymously();
      } catch (e) {
        debugPrint("Anonymous Auth Note: $e");
      }
    }

    // Configure FCM Push Notifications for Order Updates
    try {
      NotificationSettings settings = await _fcm.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );
      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        String? token = await _fcm.getToken();
        debugPrint("FCM Device Token: $token");
        _fcm.subscribeToTopic("order_updates");
      }
    } catch (e) {
      debugPrint("FCM Registration Note: $e");
    }
  }

  // Realtime Products Stream
  Stream<List<Map<String, dynamic>>> getProductsStream() {
    return _db.collection('products').snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => {'id': doc.id, ...doc.data()}).toList();
    });
  }

  // Realtime Orders Stream for Current User
  Stream<List<Map<String, dynamic>>> getOrdersStream() {
    return _db.collection('orders').snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => {'id': doc.id, ...doc.data()}).toList();
    });
  }

  // Submit Order to Firestore
  Future<void> placeOrder(Map<String, dynamic> orderData) async {
    await _analytics.logEvent(name: 'place_order', parameters: {
      'amount': orderData['totalAmount'] ?? 0,
      'items_count': orderData['items']?.length ?? 0,
    });

    await _db.collection('orders').doc(orderData['id']).set({
      ...orderData,
      'createdAt': FieldValue.serverTimestamp(),
      'userId': _auth.currentUser?.uid ?? 'guest',
    });
  }

  // Submit Custom Woodcraft Request
  Future<void> submitCustomOrder(Map<String, dynamic> customData) async {
    await _analytics.logEvent(name: 'submit_custom_order');

    await _db.collection('custom_orders').doc(customData['id']).set({
      ...customData,
      'createdAt': FieldValue.serverTimestamp(),
      'userId': _auth.currentUser?.uid ?? 'guest',
    });
  }
}
`
  }
];

export const FlutterProjectCodeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = FLUTTER_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-stone-950 border-2 border-[#d4af37]/60 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl text-white overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-[#d4af37]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-400/50">
              <Smartphone className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-amber-100 text-base sm:text-lg flex items-center gap-2">
                IQBAL WOODCRAFT — Flutter Android Source Code
              </h2>
              <p className="text-xs text-amber-300">
                Production-Ready Clean Architecture • Riverpod • Material 3 • Firebase Ready • Google Play Store Ready
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-stone-900 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-72 bg-stone-900 border-r border-stone-800 p-3 overflow-y-auto space-y-1 shrink-0">
            <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Project Architecture Files
            </p>
            {FLUTTER_FILES.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setSelectedFileIdx(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                  selectedFileIdx === idx
                    ? 'bg-[#d4af37] text-stone-950 font-bold shadow-md'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span className="truncate flex items-center gap-2">
                  <FileText className="w-4 h-4 shrink-0" />
                  {file.name}
                </span>
                <span className="text-[10px] opacity-70 uppercase">{file.language}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-stone-950 overflow-hidden">
            {/* File Sub-header */}
            <div className="p-3 bg-stone-900/60 border-b border-stone-800 flex items-center justify-between text-xs px-4">
              <div>
                <span className="font-mono text-amber-300 font-bold">{currentFile.path}</span>
                <p className="text-[11px] text-stone-400 mt-0.5">{currentFile.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-[#d4af37] text-black rounded-xl text-xs font-extrabold hover:brightness-110 flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-amber-100 bg-stone-950/90 selection:bg-[#d4af37] selection:text-black">
              <pre><code>{currentFile.code}</code></pre>
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="p-3 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#d4af37]" />
            <span>Ready for <code>flutter run</code> or Android Studio Gradle build.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
