from django.core.management.base import BaseCommand
from menu.models import Category, Product


MENU_DATA = [
    {
        "name": "Drinks",
        "name_ar": "المشروبات",
        "display_order": 1,
        "products": [
            {
                "name": "JAZI Bloom",
                "name_ar": "جازي بلوم",
                "price": 29,
                "description": "A refreshing signature drink crafted with JAZI's distinctive touch.",
                "description_ar": "مشروب منعش ومميز بلمسة جازي الخاصة.",
            },
            {
                "name": "Fresh Orange Juice",
                "name_ar": "عصير برتقال طازج",
                "price": 15,
                "description": "Freshly prepared orange juice with a bright, refreshing taste.",
                "description_ar": "عصير برتقال طازج بنكهة منعشة وطبيعية.",
            },
            {
                "name": "Açaí Smoothie",
                "name_ar": "سموذي أساي",
                "price": 40,
                "description": "A smooth and refreshing açaí blend with a rich fruity taste.",
                "description_ar": "مزيج أساي ناعم ومنعش بنكهة فاكهية غنية.",
            },
            {
                "name": "Ethiopian V60",
                "name_ar": "V60 إثيوبي",
                "price": 30,
                "description": "Ethiopian coffee carefully brewed using the V60 method.",
                "description_ar": "قهوة إثيوبية محضّرة بعناية بطريقة V60.",
            },
            {
                "name": "Hazelnut V60",
                "name_ar": "V60 بالبندق",
                "price": 35,
                "description": "V60 coffee with a smooth and aromatic hazelnut character.",
                "description_ar": "قهوة V60 بنكهة البندق الناعمة والعطرية.",
            },
            {
                "name": "Classic Matcha",
                "name_ar": "ماتشا كلاسيك",
                "price": 30,
                "description": "Smooth classic matcha with a balanced and distinctive flavor.",
                "description_ar": "ماتشا كلاسيكية ناعمة بنكهة متوازنة ومميزة.",
            },
            {
                "name": "Pinky Matcha",
                "name_ar": "بينكي ماتشا",
                "price": 30,
                "description": "A colorful JAZI twist on classic matcha.",
                "description_ar": "لمسة جازي المميزة والملونة على الماتشا الكلاسيكية.",
            },
            {
                "name": "Matcha Cheesecake",
                "name_ar": "ماتشا تشيز كيك",
                "price": 37,
                "description": "Creamy cheesecake paired with the distinctive flavor of matcha.",
                "description_ar": "تشيز كيك كريمي ممزوج بنكهة الماتشا المميزة.",
            },
            {
                "name": "Coca-Cola",
                "name_ar": "كوكا كولا",
                "price": 5,
                "description": "Chilled Coca-Cola.",
                "description_ar": "كوكا كولا باردة.",
            },
            {
                "name": "Al Ain Water",
                "name_ar": "مياه العين",
                "price": 3,
                "description": "Refreshing bottled water.",
                "description_ar": "مياه معبأة ومنعشة.",
            },
        ],
    },
    {
        "name": "Breakfast",
        "name_ar": "الإفطار",
        "display_order": 2,
        "products": [
            {
                "name": "Eggs Benedict",
                "name_ar": "إيغز بنديكت",
                "price": 29,
                "description": "A breakfast classic with eggs and a rich, satisfying finish.",
                "description_ar": "طبق إفطار كلاسيكي بالبيض بنكهة غنية ومميزة.",
            },
            {
                "name": "Avocado Toast",
                "name_ar": "توست الأفوكادو",
                "price": 35,
                "description": "Toasted bread topped with creamy avocado for a fresh start.",
                "description_ar": "خبز محمّص مع أفوكادو كريمي لبداية خفيفة ومنعشة.",
            },
            {
                "name": "Truffle Scrambled Eggs",
                "name_ar": "بيض مخفوق بالترافل",
                "price": 40,
                "description": "Soft scrambled eggs elevated with the distinctive aroma of truffle.",
                "description_ar": "بيض مخفوق ناعم بلمسة ونكهة الترافل المميزة.",
            },
        ],
    },
    {
        "name": "Main Courses",
        "name_ar": "الأطباق الرئيسية",
        "display_order": 3,
        "products": [
            {
                "name": "Lobster Roll",
                "name_ar": "لوبستر رول",
                "price": 65,
                "description": "Tender lobster served in a soft toasted roll.",
                "description_ar": "لوبستر طري يُقدّم في خبز رول محمّص وطري.",
            },
            {
                "name": "Steak",
                "name_ar": "ستيك",
                "price": 70,
                "description": "A rich and satisfying steak prepared for a bold, savory experience.",
                "description_ar": "ستيك غني بالنكهة محضّر لتجربة شهية ومميزة.",
            },
            {
                "name": "Truffle Burger",
                "name_ar": "برغر الترافل",
                "price": 42,
                "description": "A savory burger finished with the distinctive flavor of truffle.",
                "description_ar": "برغر شهي بلمسة من نكهة الترافل المميزة.",
            },
            {
                "name": "Shrimp",
                "name_ar": "روبيان",
                "price": 38,
                "description": "Tender shrimp prepared for a simple and flavorful seafood experience.",
                "description_ar": "روبيان طري محضّر لنكهة بحرية شهية ومميزة.",
            },
            {
                "name": "Calamari",
                "name_ar": "كالاماري",
                "price": 35,
                "description": "Flavorful calamari with a satisfying seafood taste.",
                "description_ar": "كالاماري شهي بنكهة بحرية مميزة.",
            },
            {
                "name": "Creamy Shrimp & Mushroom Pasta",
                "name_ar": "باستا كريمية بالروبيان والمشروم",
                "price": 52,
                "description": "Creamy pasta combining tender shrimp and mushrooms in a rich sauce.",
                "description_ar": "باستا كريمية تجمع بين الروبيان الطري والمشروم بصوص غني.",
            },
        ],
    },
    {
        "name": "Starters",
        "name_ar": "المقبلات",
        "display_order": 4,
        "products": [
            {
                "name": "Corn Steak",
                "name_ar": "ستيك الذرة",
                "price": 25,
                "description": "A flavorful corn starter with a satisfying savory finish.",
                "description_ar": "مقبلات من الذرة بنكهة شهية ومميزة.",
            },
            {
                "name": "Crispy Halloumi",
                "name_ar": "حلومي مقرمش",
                "price": 32,
                "description": "Crispy halloumi with a golden exterior and a soft center.",
                "description_ar": "جبنة حلومي مقرمشة من الخارج وطرية من الداخل.",
            },
            {
                "name": "Truffle Fries",
                "name_ar": "بطاطا بالترافل",
                "price": 22,
                "description": "Crispy fries finished with the distinctive flavor of truffle.",
                "description_ar": "بطاطا مقرمشة بلمسة من نكهة الترافل المميزة.",
            },
        ],
    },
    {
        "name": "Salads",
        "name_ar": "السلطات",
        "display_order": 5,
        "products": [
            {
                "name": "Burrata Salad",
                "name_ar": "سلطة البوراتا",
                "price": 30,
                "description": "A fresh salad centered around soft and creamy burrata.",
                "description_ar": "سلطة منعشة مع جبنة البوراتا الطرية والكريمية.",
            },
            {
                "name": "Crab Salad",
                "name_ar": "سلطة السلطعون",
                "price": 35,
                "description": "A fresh seafood salad featuring delicate crab flavors.",
                "description_ar": "سلطة بحرية منعشة بنكهة السلطعون المميزة.",
            },
        ],
    },
    {
        "name": "Desserts",
        "name_ar": "الحلويات",
        "display_order": 6,
        "products": [
            {
                "name": "Tiramisu",
                "name_ar": "تيراميسو",
                "price": 39,
                "description": "A creamy Italian-inspired dessert with rich coffee notes.",
                "description_ar": "حلوى كريمية مستوحاة من المطبخ الإيطالي بنكهة القهوة الغنية.",
            },
            {
                "name": "Cheesecake",
                "name_ar": "تشيز كيك",
                "price": 40,
                "description": "Smooth and creamy cheesecake with a rich finish.",
                "description_ar": "تشيز كيك ناعم وكريمي بنكهة غنية.",
            },
            {
                "name": "French Toast",
                "name_ar": "فرنش توست",
                "price": 35,
                "description": "Soft French toast with a warm and indulgent character.",
                "description_ar": "فرنش توست طري ودافئ بطابع غني وشهي.",
            },
            {
                "name": "Chocolate Pudding",
                "name_ar": "بودينغ الشوكولاتة",
                "price": 40,
                "description": "A smooth and rich chocolate dessert for chocolate lovers.",
                "description_ar": "حلوى شوكولاتة ناعمة وغنية لعشاق الشوكولاتة.",
            },
            {
                "name": "Açaí Bowl",
                "name_ar": "وعاء أساي",
                "price": 42,
                "description": "A refreshing açaí bowl with a rich fruity character.",
                "description_ar": "وعاء أساي منعش بنكهة فاكهية غنية.",
            },
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the JAZI menu into the database"

    def handle(self, *args, **options):
        for category_data in MENU_DATA:
            category, _ = Category.objects.update_or_create(
                name=category_data["name"],
                defaults={
                    "name_ar": category_data["name_ar"],
                    "display_order": category_data["display_order"],
                    "is_active": True,
                },
            )

            for index, product_data in enumerate(
                category_data["products"],
                start=1,
            ):
                Product.objects.update_or_create(
                    category=category,
                    name=product_data["name"],
                    defaults={
                        "name_ar": product_data["name_ar"],
                        "description": product_data["description"],
                        "description_ar": product_data["description_ar"],
                        "price": product_data["price"],
                        "display_order": index,
                        "is_active": True,
                        "is_available": True,
                    },
                )

        self.stdout.write(
            self.style.SUCCESS(
                "JAZI menu seeded successfully with bilingual descriptions."
            )
        )