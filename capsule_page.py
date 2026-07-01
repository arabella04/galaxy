import flet as ft

def build_page_2(go_to_page1, go_to_interactive_cursor):
    top_bar = ft.Container(
        padding=ft.Padding(20, 15, 20, 15),
        content=ft.Row(
            [
                ft.IconButton(
                    icon=ft.Icons.ARROW_BACK_IOS_NEW_ROUNDED,
                    icon_color="#6D4C41",
                    on_click=go_to_page1,
                    tooltip="Go Back"
                ),
                ft.Text(
                    value="AAAAAAAAAAAAAAAAAH NVM THIS PART", 
                    size=20, 
                    weight=ft.FontWeight.W_600, 
                    color="#6D4C41",
                    font_family="Georgia"
                ),
                ft.Icon(ft.Icons.FAVORITE_ROUNDED, color="#EC407A", size=20)
            ],
            alignment=ft.MainAxisAlignment.SPACE_BETWEEN
        )
    )

    def create_menu_card(title, subtitle, icon, click_action=None):
        return ft.Container(
            width=170,
            height=220,
            bgcolor="#FFFFFF",
            border_radius=20,
            padding=20,
            scale=1.0, 
            shadow=ft.BoxShadow(blur_radius=10, color="#1A000000", offset=ft.Offset(0, 4)),
            animate=ft.Animation(300, ft.AnimationCurve.EASE_OUT),
            on_hover=lambda e: toggle_hover(e),
            on_click=click_action, 
            content=ft.Column(
                [
                    ft.Icon(icon, color="#EC407A", size=32),
                    ft.Container(height=10),
                    ft.Text(title, size=16, weight=ft.FontWeight.BOLD, color="#6D4C41"),
                    ft.Text(subtitle, size=12, color="#8D6E63"),
                ],
                alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                horizontal_alignment="start" 
            )
        )

    def toggle_hover(e):
        e.control.scale = 1.05 if e.data == "true" or e.data is True else 1.0
        e.control.update()

    cards_row = ft.Row(
        [
            create_menu_card("Interactive Cursor", "If you're bored, click here...", ft.Icons.MOUSE_ROUNDED, go_to_interactive_cursor),
            create_menu_card("Things Unsaid", "If things get heavy, put your thoughts here", ft.Icons.FAVORITE_ROUNDED),
            create_menu_card("Songs for Her", "Every song that was made for you", ft.Icons.MUSIC_NOTE_ROUNDED),
            create_menu_card("Messages to Her", "Don't click this one", ft.Icons.MARK_EMAIL_READ_ROUNDED),
        ],
        alignment=ft.MainAxisAlignment.CENTER,
        spacing=25
    )

    return ft.Stack(
        expand=True,
        controls=[
            ft.Container(
                expand=True,
                gradient=ft.LinearGradient(
                    begin="topCenter",
                    end="bottomCenter",
                    colors=["#FFF0F2", "#E8F7EE"]
                ),
            ),
            ft.Container(
                top=0,      
                right=0,    
                content=ft.Image(
                    src="flower2.png", 
                    width=1050,   
                    height=600,   
                    fit="cover"   
                )
            ),
            ft.Column(
                [
                    top_bar,
                    ft.Container(height=40),
                    ft.Text(
                        "Select a capsule to read:",
                        size=16,
                        italic=True,
                        color="#8D6E63",
                        text_align=ft.TextAlign.CENTER
                    ),
                    ft.Container(height=20),
                    cards_row
                ],
                horizontal_alignment=ft.CrossAxisAlignment.CENTER
            )
        ]
    )