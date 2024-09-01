package models

type Point struct {
	Id   string `json:"id" bson:"id"`
	Name string `json:"n" bson:"n"`
	X    int32  `json:"x" bson:"x"`
	Y    int32  `json:"y" bson:"y"`
}

type Test struct {
	Id        string  `json:"id" bson:"_id"`
	ShortId   string  `json:"shortId" bson:"shortId"`
	Name      string  `json:"name" bson:"name"`
	PointSize int32   `json:"pointSize" bson:"pointSize"`
	ImageURL  string  `json:"imageUrl" bson:"imageUrl"`
	Points    []Point `json:"points" bson:"points"`
}

type MinifiedTest struct {
	ShortId string `json:"shortId" bson:"shortId"`
	Name    string `json:"name" bson:"name"`
}
