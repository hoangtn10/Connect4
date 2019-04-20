import random
import copy

board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
]
PLAYER1 = 1
PLAYER2 = 2
mode = "ai_minimax"


def valid_moves():
    valid_move_list = []
    for i in range(0, 7):
        if board[0][i] == 0:
            valid_move_list.append(i)
    return valid_move_list


def drop_at(location, player, input_board):
    if input_board[0][location] != 0:
        return -1
    for i in range(6, -1, -1):
        if input_board[i][location] == 0:
            input_board[i][location] = player
            return 0


def is_won(player, input_board):
    # Check horizontal
    for row in range(0, 7):
        for col in range(0, 4):
            won = True
            for inc in range(0, 4):
                if input_board[row][col + inc] != player:
                    won = False
            if won:
                return won
    # Check vertical
    for row in range(0, 4):
        for col in range(0, 7):
            won = True
            for inc in range(0, 4):
                if input_board[row + inc][col] != player:
                    won = False
            if won:
                return won
    # Check diagonals
    for row in range(0, 4):
        for col in range(0, 4):
            won = True
            for inc in range(0, 4):
                if input_board[row + inc][col + inc] != player:
                    won = False
            if won:
                return won
    # check diagonal-backward
    for row in range(6, 2, -1):
        for col in range(0, 4):
            won = True
            for inc in range(0, 4):
                if input_board[row - inc][col + inc] != player:
                    won = False
            if won:
                return won
    return False


def print_board(input_board):
    for row in input_board:
        print(row)


def vs_mode():
    turn = PLAYER1
    while True:
        print_board(board)
        for i in range(0, 7):
            print(get_point(i, PLAYER1, board))
        location = input("Player{} turn: ".format(turn))
        success = drop_at(int(location), turn, board)
        if success != 0:
            print("Illegal location, try again")
            continue

        if is_won(turn, board):
            print_board(board)
            print("Player{} Won!".format(turn))
            break

        turn = PLAYER2 if turn == PLAYER1 else PLAYER1


def ai_rand_mode():
    turn = PLAYER1
    ai = PLAYER1
    while True:
        print_board(board)
        if turn != ai:
            location = input("Player{} turn: ".format(turn))
            success = drop_at(int(location), turn, board)
            if success != 0:
                print("Illegal location, try again")
                continue
        else:
            valid_move_list = valid_moves()
            if len(valid_move_list) == 0:
                break
            random_location_index = random.randint(0, len(valid_move_list) - 1)
            print("Player{} turn: {}".format(turn, valid_move_list[random_location_index]))
            drop_at(valid_move_list[random_location_index], ai, board)

        if is_won(turn, board):
            print_board(board)
            print("Player{} Won!".format(turn))
            break

        turn = PLAYER2 if turn == PLAYER1 else PLAYER1


def ai_easy_mode():
    turn = PLAYER1
    ai = PLAYER2
    while True:
        print_board(board)
        if turn != ai:
            location = input("Player{} turn: ".format(turn))
            success = drop_at(int(location), turn, board)
            if success != 0:
                print("Illegal location, try again")
                continue
        else:
            valid_move_list = valid_moves()
            if len(valid_move_list) == 0:
                break
            max_point = [-10000, 3]
            for i in range(0, 7, 1):
                if i in valid_move_list:
                    point = get_point(i, turn, board)
                    print(point)
                    if point > max_point[0]:
                        max_point = [point, i]
            print("Player{} turn: {}".format(turn, valid_move_list[max_point[1]]))
            drop_at(valid_move_list[max_point[1]], ai, board)

        if is_won(turn, board):
            print_board(board)
            print("Player{} Won!".format(turn))
            break

        turn = PLAYER2 if turn == PLAYER1 else PLAYER1


def ai_minimax_mode():
    turn = PLAYER1
    ai = PLAYER2
    while True:
        print_board(board)
        if turn != ai:
            location = input("Player{} turn: ".format(turn))
            success = drop_at(int(location), turn, board)
            if success != 0:
                print("Illegal location, try again")
                continue
        else:
            valid_move_list = valid_moves()
            if len(valid_move_list) == 0:
                break

            minimax_list = minimax(3, turn, board)
            print('List = {}'.format(minimax_list))
            max_value = max(minimax_list)
            location = minimax_list.index(max_value)

            print("Player{} turn: {}".format(turn, location))
            drop_at(location, ai, board)
        if is_won(turn, board):
            print_board(board)
            print("Player{} Won!".format(turn))
            break

        turn = PLAYER2 if turn == PLAYER1 else PLAYER1


def minimax(depth, player, input_board):
    opponent = PLAYER1
    if player == PLAYER1:
        opponent = PLAYER2

    point_list = []
    if depth == 1:
        for i in range(0, 7, 1):
            point_list.append(get_point(i, player, input_board))
        print_board(input_board)
        print('depth = 1 player = {} {}'.format(player, point_list))
        return point_list

    # if depth is odd
    if depth % 2 == 1:
        for i in range(0, 7, 1):
            new_board = copy.deepcopy(input_board)
            success = drop_at(i, player, new_board)
            if success == -1:
                point_list.append(-10000)
            elif is_won(player, new_board):
                point_list.append(1000)
            else:
                minimaxed_point_list = minimax(depth - 1, opponent, new_board)
                point_list.append(max(minimaxed_point_list))
    # if depth is even
    else:
        for i in range(0, 7, 1):
            new_board = copy.deepcopy(input_board)
            success = drop_at(i, player, new_board)
            if success == -1:
                point_list.append(-10000)
            elif is_won(player, new_board):
                point_list.append(-1000)
            else:
                minimaxed_point_list = minimax(depth - 1, opponent, new_board)
                point_list.append(min(minimaxed_point_list))
    print('depth = {} {}'.format(depth, point_list))
    return point_list


def get_row(location, input_board):
    for i in range(6, -1, -1):
        if input_board[i][location] == 0:
            return i
    return -1


def count_point(count):
    if count == 1:
        return 2
    elif count == 2:
        return 5
    elif count == 3:
        return 1000
    return 0


def count_point_opponent(count):
    if count == 2:
        return -2
    elif count == 3:
        return -100
    return 0


def get_point(location, player, input_board):
    point = 0
    count = 0
    row = get_row(location, input_board)
    col = location
    new_board = copy.deepcopy(input_board)
    # Check middle
    if col == 3:
        point += 4
    # Check vertical
    for inc in range(0, 4):
        if row + inc > 6:
            break
        disc = new_board[row + inc][col]
        if disc != player and disc != 0:
            count = 0
            break
        if disc != 0:
            count += 1
    point += count_point(count)
    # Check horizontal
    for new_col in range(0, 4):
        count = 0
        if new_col + 3 < col or new_col > col:
            continue
        # if new_col + 4 < 6:
        #     if check_three_in_middle(player, new_board, [row, new_col], [row, new_col + 1], [row, new_col + 2],
        #                              [row, new_col + 3], [row, new_col + 4]):
        #         point += 900
        #         break
        if check_two_in_middle(player, new_board, [row, new_col], [row, new_col + 1], [row, new_col + 2],
                               [row, new_col + 3]):
            point += 500
            # break
        for inc in range(0, 4):
            disc = new_board[row][new_col + inc]
            if disc != player and disc != 0:
                count = 0
                break
            if disc != 0:
                count += 1
        point += count_point(count)
    # Check diagonal
    for dec in range(3, -1, -1):
        count = 0
        if row - dec < 0 or col - dec < 0 or row - dec + 3 > 6 or col - dec + 3 > 6:
            continue
        # if row - dec + 4 < 6 and col - dec + 4 < 6:
        #     if check_three_in_middle(player, new_board, [row - dec, col - dec], [row - dec + 1, col - dec + 1],
        #                              [row - dec + 2, col - dec + 2], [row - dec + 3, col - dec + 3],
        #                              [row - dec + 4, col - dec + 4]):
        #         point += 900
        #         break
        if check_two_in_middle(player, new_board, [row - dec, col - dec], [row - dec + 1, col - dec + 1],
                               [row - dec + 2, col - dec + 2], [row - dec + 3, col - dec + 3]):
            point += 500
            # break
        for inc in range(0, 4):
            disc = new_board[row - dec + inc][col - dec + inc]
            if disc != player and disc != 0:
                count = 0
                break
            if disc != 0:
                count += 1
        point += count_point(count)
    # check diagonal-backward
    for dec_inc in range(3, -1, -1):
        count = 0
        if row + dec_inc > 6 or col - dec_inc < 0 or row + dec_inc - 3 < 0 or col - dec_inc + 3 > 6:
            continue
        # if row + dec_inc - 4 < 0 and col - dec_inc + 4 < 6:
        #     if check_three_in_middle(player, new_board, [row + dec_inc, col - dec_inc],
        #                              [row + dec_inc - 1, col - dec_inc + 1], [row + dec_inc - 2, col - dec_inc + 2],
        #                              [row + dec_inc - 3, col - dec_inc + 3], [row + dec_inc - 4, col - dec_inc + 4]):
        #         point += 900
        #         break
        if check_two_in_middle(player, new_board, [row + dec_inc, col - dec_inc],
                               [row + dec_inc - 1, col - dec_inc + 1], [row + dec_inc - 2, col - dec_inc + 2],
                               [row + dec_inc - 3, col - dec_inc + 3]):
            point += 500
            # break
        for inc in range(0, 4):
            disc = new_board[row + dec_inc - inc][col - dec_inc + inc]
            if disc != player and disc != 0:
                count = 0
                break
            if disc != 0:
                count += 1
        point += count_point(count)

    opponent_point = 0
    new_board[row][col] = player
    for i in range(0, 7, 1):
        if player == PLAYER1:
            opponent_point = min(opponent_point, get_opponent_point(i, PLAYER2, new_board))
        else:
            opponent_point = min(opponent_point, get_opponent_point(i, PLAYER1, new_board))
    return point + opponent_point


def check_two_in_middle(player, new_board, pos1, pos2, pos3, pos4):
    if new_board[pos1[0]][pos1[1]] == 0:
        if new_board[pos2[0]][pos2[1]] == player:
            if new_board[pos3[0]][pos3[1]] == player:
                if new_board[pos4[0]][pos4[1]] == 0:
                    if get_row(pos1[1], new_board) == pos1[0]:
                        if get_row(pos4[1], new_board) == pos4[0]:
                            return True
    return False


def check_three_in_middle(player, new_board, pos1, pos2, pos3, pos4, pos5):
    if new_board[pos1[0]][pos1[1]] == 0:
        if new_board[pos2[0]][pos2[1]] == player:
            if new_board[pos3[0]][pos3[1]] == player:
                if new_board[pos4[0]][pos4[1]] == player:
                    if new_board[pos5[0]][pos5[1]] == 0:
                        if get_row(pos1[1], new_board) == pos1[0]:
                            if get_row(pos5[1], new_board) == pos5[0]:
                                return True
    return False


def get_opponent_point(location, player, new_board):
    point = 0
    count = 0
    row = get_row(location, new_board)
    col = location
    # Check vertical
    for inc in range(0, 4):
        if row + inc > 6:
            break
        disc = new_board[row + inc][col]
        if disc != player and disc != 0:
            count = 0
            break
        if disc != 0:
            count += 1
    point += count_point_opponent(count)
    # Check horizontal
    for new_col in range(0, 4):
        count = 0
        if new_col + 3 < col or new_col > col:
            continue
        if check_two_in_middle(player, new_board, [row, new_col], [row, new_col + 1], [row, new_col + 2],
                               [row, new_col + 3]):
            point += -50
            break
        for inc in range(0, 4):
            disc = new_board[row][new_col + inc]
            if disc != player and disc != 0:
                count = 0
                break
            if disc != 0:
                count += 1
        point += count_point_opponent(count)
    # Check diagonal
    for dec in range(3, -1, -1):
        count = 0
        if row - dec < 0 or col - dec < 0 or row - dec + 3 > 6 or col - dec + 3 > 6:
            continue
        if check_two_in_middle(player, new_board, [row - dec, col - dec], [row - dec + 1, col - dec + 1],
                               [row - dec + 2, col - dec + 2], [row - dec + 3, col - dec + 3]):
            point += -50
            break
        for inc in range(0, 4):
            disc = new_board[row - dec + inc][col - dec + inc]
            if disc != player and disc != 0:
                count = 0
                break
            if disc != 0:
                count += 1
        point += count_point_opponent(count)
    # check diagonal-backward
    for dec_inc in range(3, -1, -1):
        count = 0
        if row + dec_inc > 6 or col - dec_inc < 0 or row + dec_inc - 3 < 0 or col - dec_inc + 3 > 6:
            continue
        if check_two_in_middle(player, new_board, [row + dec_inc, col - dec_inc],
                               [row + dec_inc - 1, col - dec_inc + 1], [row + dec_inc - 2, col - dec_inc + 2],
                               [row + dec_inc - 3, col - dec_inc + 3]):
            point += -50
            break
        for inc in range(0, 4):
            disc = new_board[row + dec_inc - inc][col - dec_inc + inc]
            if disc != player and disc != 0:
                count = 0
                break
            if disc != 0:
                count += 1
        point += count_point_opponent(count)

    return point


def main():
    ai_minimax_mode()
    # if mode == "vs":
    #     vs_mode()
    # if mode == 'ai_rand':
    #     ai_rand_mode()
    # if mode == 'ai_easy':
    #     ai_easy_mode()
    # if mode == 'ai_minimax':
    #     ai_minimax_mode()


if __name__ == '__main__':
    main()
