import flet as ft
import math
import random
import threading

def build_interactive_cursor_page(go_to_page2):
    instruction_text = ft.Text(
        value="Lead the fireflies, and click the water...",
        color="#E0E0E0",
        size=18,
        italic=True,
        font_family="Georgia",
        top=30,
        left=350
    )

    sweet_messages = [
        "A sunset says, 'you made it through today.'",
        "Take a deep breath. You are doing enough.",
        "Rest now, the world can wait.",
        "You don't have to carry it all by yourself.",
        "Every long shift you finish is a victory, Nurse.",
        "Even in the quiet moments, my mind is loud with thoughts of you.",
        "Just like these fireflies, you light up the dark parts of my days.",
        "April 8 was just the beginning of my favorite story.",
        "Taking care of others is your gift, but don't forget to take care yourself too, Nurse."
    ]

    # FIX 1: Removed the Container. Just a pure Text widget that auto-centers!
    hidden_msg = ft.Text(
        value="", 
        size=36, 
        color="#FFF176", 
        italic=True, 
        weight=ft.FontWeight.W_400, 
        font_family="Comic Sans MS", 
        text_align="center",
        left=0,
        right=0, # Forces perfect horizontal centering
        top=270,
        opacity=0, 
        animate_opacity=ft.Animation(1000, ft.AnimationCurve.EASE_IN_OUT)
    )

    back_btn = ft.IconButton(
        icon=ft.Icons.ARROW_BACK_IOS_NEW_ROUNDED,
        icon_color="#FFFFFF",
        on_click=go_to_page2,
        tooltip="Back to Capsules",
        top=15,
        left=15
    )

    particles = []
    colors = ["#FFD700", "#FFE066", "#F48FB1", "#FFFFFF", "#FFCC80"]
    icons = [ft.Icons.FAVORITE_ROUNDED, ft.Icons.STAR_ROUNDED, ft.Icons.AUTO_AWESOME, ft.Icons.STAR_BORDER]

    for i in range(45): 
        duration = 100 + (i * 25) 
        
        icon_name = icons[i % len(icons)]
        icon_color = colors[i % len(colors)]
        size = 12 if i % 2 == 0 else 24

        p = ft.Icon(
            icon_name,
            color=icon_color,
            size=size,
            left=525,
            top=300,
            scale=1.0,
            rotate=0.0, 
            animate_position=ft.Animation(duration, ft.AnimationCurve.EASE_OUT),
            animate_scale=ft.Animation(400, ft.AnimationCurve.BOUNCE_OUT),
            animate_rotation=ft.Animation(500, ft.AnimationCurve.LINEAR)
        )
        particles.append(p)

    scattered = False

    def handle_mouse_move(e: ft.HoverEvent):
        nonlocal scattered
        if scattered:
            return 

        mx = e.local_position.x
        my = e.local_position.y

        for i, p in enumerate(particles):
            offset_x = math.sin(i * 0.8 + (mx * 0.01)) * (15 + (i * 2))
            offset_y = math.cos(i * 0.8 + (my * 0.01)) * (15 + (i * 2))
            
            p.left = max(0, min(mx + offset_x - (p.size / 2), 1050 - p.size))
            p.top = max(0, min(my + offset_y - (p.size / 2), 600 - p.size))
            
            p.rotate = (p.rotate or 0) + 0.2
            p.update()

    def handle_click(e: ft.TapEvent):
        nonlocal scattered
        if scattered:
            return
            
        scattered = True
        
        # NOTE: Updated to `.value` since we removed the Container wrapper
        hidden_msg.value = random.choice(sweet_messages)
        hidden_msg.opacity = 1
        hidden_msg.update()

        for p in particles:
            p.left = random.randint(-50, 1100) 
            p.top = random.randint(-50, 650)
            p.scale = random.uniform(1.0, 4.5) 
            p.rotate = (p.rotate or 0) + random.uniform(3.14, 15.0) 
            p.update()
        
        def reset_swarm():
            nonlocal scattered
            scattered = False
            
            hidden_msg.opacity = 0
            try:
                hidden_msg.update()
            except:
                pass
                
            for p in particles:
                p.scale = 1.0
                try:
                    p.update()
                except:
                    pass

        threading.Timer(2.5, reset_swarm).start()

    # FIX 2: A Master Stack that permanently isolates the background image 
    galaxy_canvas = ft.Stack(
        width=1050,
        height=600,
        controls=[
            # Layer 1: The untouched background image
            ft.Image(
                src="galaxy.jpg", 
                fit="cover",
                width=1050,
                height=600
            ),
            # Layer 2: The interactive elements layered safely on top
            ft.GestureDetector(
                on_hover=handle_mouse_move,
                on_tap_down=handle_click, 
                width=1050,
                height=600,
                content=ft.Stack(
                    controls=[
                        hidden_msg, 
                        instruction_text,
                        back_btn,
                        *particles
                    ]
                )
            )
        ]
    )
    return galaxy_canvas