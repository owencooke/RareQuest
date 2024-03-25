import pygame
import sys
import random

pygame.init()

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Find Wally")

background_image = pygame.image.load("background.jpg")  
wally_image = pygame.image.load("wally.png")

def place_wally():
    wally_width = wally_image.get_width()
    wally_height = wally_image.get_height()
    x = random.randint(0, SCREEN_WIDTH - wally_width)
    y = random.randint(0, SCREEN_HEIGHT - wally_height)
    return (x, y)

def main():
    wally_pos = place_wally()

    while True:
        screen.blit(background_image, (0, 0))

        screen.blit(wally_image, wally_pos)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.MOUSEBUTTONDOWN:
                mouse_pos = pygame.mouse.get_pos()
                wally_rect = wally_image.get_rect(topleft=wally_pos)
                if wally_rect.collidepoint(mouse_pos):
                    print("You found Wally!")
                    wally_pos = place_wally()

        pygame.display.flip()

if __name__ == "__main__":
    main()
