import csv

## open first csv file and create list of tuples
with open('current.csv', 'rb') as csvfile:
    testReader = csv.reader(csvfile)
    currentList = list(testReader)

# Create list of names and years: convert from tuples to 1D arrays (mutable)
allBuildings = []
cit = []
rock = []
hay = []
faunce = []
barus = []
scili = []
andrews = []
jww = []
watson = []
ratty = []
# can't do with extend b/c want list of lists
allBuildings.append(cit)
allBuildings.append(rock)
allBuildings.append(hay)
allBuildings.append(faunce)
allBuildings.append(barus)
allBuildings.append(scili)
allBuildings.append(andrews)
allBuildings.append(jww)
allBuildings.append(watson)
allBuildings.append(ratty)

for index, elem in enumerate(allBuildings):
    for a in zip(*currentList)[index+1]:
        elem.append(a)


with open('final.csv', 'rb') as csvfile:
    outReader = csv.reader(csvfile)
    new_rows = []
    for row in outReader:     # iterate over the rows in the file
        new_row = row      # at first, just copy the row
        new_rows.append(new_row) # add the modified rows

row = 0
for building in allBuildings:
    i = 1
    #MONDAY
    for x in range(row+1, row+20):
        cell = int(new_rows[x][3])
        cell += int(building[i])
        new_rows[x][3] = str(cell)
        print(new_rows[x][3]);
        i+=1
    # at this point, i = 20, but need to skip the 'holder' row
    i+=1 #now i is 21, and row will start at 21

    #TUESDAY
    for x in range(row+21, row+40):
        cell = int(new_rows[x][3])
        cell += int(building[i])
        new_rows[x][3] = str(cell)
        print(new_rows[x][3]);
        i+=1
    i+=1

    #WEDNESDAY
    for x in range(row+41, row+60):
        cell = int(new_rows[x][3])
        cell += int(building[i])
        new_rows[x][3] = str(cell)
        i+=1
    i+=1

    #THURSDAY
    for x in range(row+61, row+80):
        cell = int(new_rows[x][3])
        cell += int(building[i])
        new_rows[x][3] = str(cell)
        i+=1
    i+=1

    #FRIDAY
    for x in range(row+81, row+100):
        cell = int(new_rows[x][3])
        cell += int(building[i])
        new_rows[x][3] = str(cell)
        i+=1
    i+=1

    #SATURDAY
    for x in range(row+101, row+120):
        cell = int(new_rows[x][3])
        cell += int(building[i])
        new_rows[x][3] = str(cell)
        i+=1
    i+=1

    #SUNDAY
    for x in range(row+121, row+140):
        cell = int(new_rows[x][3])
        cell += int(building[i])
        new_rows[x][3] = str(cell)
        i+=1
    i+=1
    row+=140

with open('final.csv', 'wb') as f:
    # Overwrite the old file with the modified rows
    writer = csv.writer(f)
    writer.writerows(new_rows)
