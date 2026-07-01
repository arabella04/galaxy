import flet as ft
import os

# Import your custom pages from the other files!
from capsule_page import build_page_2
from cursor_page import build_interactive_cursor_page

def main(page: ft.Page):
    page.title = "To Her"
    
    # Web App Window Settings
    page.window.width = 1050
    page.window.height = 600
    page.window.resizable = False  
    page.padding = 0
    page.bgcolor = "#FFF0F2"  

    base_dir = os.path.dirname(os.path.abspath(__file__))
    page.assets_dir = os.path.join(base_dir, "assets")

    # --- ROUTING / NAVIGATION CONTROLLERS ---
    def go_to_page1(e):
        page.clean()
        page.add(main_layout)
        page.update()

    def go_to_page2(e):
        page.clean()
        # Passes controllers to the external capsule generator
        page.add(build_page_2(go_to_page1, go_to_interactive_cursor))
        page.update()

    def go_to_interactive_cursor(e):
        page.clean()
        # Passes the return controller to the celestial canvas layout
        page.add(build_interactive_cursor_page(go_to_page2))
        page.update()

    # --- PAGE 1 LAYOUT (Landing Screen) ---
    main_layout = ft.Stack(
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
                bottom=-20, 
                right=-20,
                content=ft.Image(
                    src="flower.png", 
                    width=750,  
                    height=450,
                    fit="contain" 
                )
            ),
            ft.Container(
                alignment=ft.Alignment(0, -0.1),
                content=ft.Column(
                    [
                        ft.Text(
                            value='"Hi :)"',
                            size=56,  
                            weight=ft.FontWeight.W_500,
                            color="#6D4C41", 
                            italic=True,
                            font_family="Georgia"
                        ),
                        ft.Container(height=25),
                        ft.Button(
                            content=ft.Text(
                                value="click here", 
                                size=16, 
                                weight=ft.FontWeight.W_500,
                                color="#6D4C41"
                            ),
                            on_click=go_to_page2, 
                            style=ft.ButtonStyle(
                                bgcolor="#FFFFFF", 
                                padding=ft.Padding(40, 22, 40, 22), 
                                shape=ft.RoundedRectangleBorder(radius=30),
                                elevation=2,
                                overlay_color="#FFF5F5" 
                            )
                        ),
                    ],
                    horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                    alignment=ft.MainAxisAlignment.CENTER,
                )
            )
        ]
    )

    page.add(main_layout)

ft.run(main)