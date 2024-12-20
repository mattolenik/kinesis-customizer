package keyboard

import "kinesis-customizer/maps"

type KeyboardID string

const (
	FSEdgeRGB KeyboardID = "FS EDGE RGB"
	// TKO KeyboardName = "???" // TODO: Kinesis TKO support
)

type KeyboardInfo struct {
	UsbInfo KeyboardUsbInfo
	ID      KeyboardID
	Keys    *maps.StableMap[string, *KeyInfo]
}

type KeyboardUsbInfo struct {
	Manufacturer, Product string
	// Manufacturer:"Kinesis", Product:"Freestyle Edge RGB Keyboard
}

type KeyInfo struct {
	ID, Name string
}

var FreestyleEdgeRGBKeyboard = KeyboardInfo{
	UsbInfo: KeyboardUsbInfo{
		Manufacturer: "Kinesis",
		Product:      "Freestyle Edge RGB Keyboard",
	},
	ID: FSEdgeRGB,
	Keys: maps.ToStableMap([]*KeyInfo{
		// Entries ordered to match the physical keyboard, left to right, row by row
		{ID: "hk0", Name: "«"},
		{ID: "esc", Name: "Escape"},
		{ID: "F1", Name: "F1"},
		{ID: "F2", Name: "F2"},
		{ID: "F3", Name: "F3"},
		{ID: "F4", Name: "F4"},
		{ID: "F5", Name: "F5"},
		{ID: "F6", Name: "F6"},
		{ID: "F7", Name: "F7"},
		{ID: "F8", Name: "F8"},
		{ID: "F9", Name: "F9"},
		{ID: "F10", Name: "F10"},
		{ID: "F11", Name: "F11"},
		{ID: "F12", Name: "F12"},
		{ID: "prnt", Name: "Printscreen"},
		{ID: "pause", Name: "Pause"},
		{ID: "del", Name: "Delete"},
		{ID: "hk1", Name: "①"},
		{ID: "hk2", Name: "②"},
		{ID: "tilde", Name: "Tilde"},
		{ID: "1", Name: "1"},
		{ID: "2", Name: "2"},
		{ID: "3", Name: "3"},
		{ID: "4", Name: "4"},
		{ID: "5", Name: "5"},
		{ID: "6", Name: "6"},
		{ID: "7", Name: "7"},
		{ID: "8", Name: "8"},
		{ID: "9", Name: "9"},
		{ID: "0", Name: "0"},
		{ID: "hyph", Name: "Hyphen"},
		{ID: "=", Name: "Equals"},
		{ID: "bspc", Name: "Backspace"},
		{ID: "home", Name: "Home"},
		{ID: "hk3", Name: "③"},
		{ID: "hk4", Name: "④"},
		{ID: "tab", Name: "Tab"},
		{ID: "q", Name: "Q"},
		{ID: "w", Name: "W"},
		{ID: "e", Name: "E"},
		{ID: "r", Name: "R"},
		{ID: "t", Name: "T"},
		{ID: "y", Name: "Y"},
		{ID: "u", Name: "U"},
		{ID: "i", Name: "I"},
		{ID: "o", Name: "O"},
		{ID: "p", Name: "P"},
		{ID: "obrk", Name: "Bracket Open"},
		{ID: "cbrk", Name: "Bracket Close"},
		{ID: `\`, Name: "Backslash"},
		{ID: "end", Name: "End"},
		{ID: "hk5", Name: "⑤"},
		{ID: "hk6", Name: "⑥"},
		{ID: "caps", Name: "Capslock"},
		{ID: "a", Name: "A"},
		{ID: "s", Name: "S"},
		{ID: "d", Name: "D"},
		{ID: "f", Name: "F"},
		{ID: "g", Name: "G"},
		{ID: "h", Name: "H"},
		{ID: "j", Name: "J"},
		{ID: "k", Name: "K"},
		{ID: "l", Name: "L"},
		{ID: "colon", Name: "Colon"},
		{ID: "apos", Name: "Apostrophe"},
		{ID: "ent", Name: "Enter"},
		{ID: "pup", Name: "Page Up"},
		{ID: "hk7", Name: "⑦"},
		{ID: "hk8", Name: "⑧"},
		{ID: "lshft", Name: "Shift (Left)"},
		{ID: "z", Name: "Z"},
		{ID: "x", Name: "X"},
		{ID: "c", Name: "C"},
		{ID: "v", Name: "V"},
		{ID: "b", Name: "B"},
		{ID: "n", Name: "N"},
		{ID: "m", Name: "M"},
		{ID: "com", Name: "Comma"},
		{ID: "per", Name: "Period"},
		{ID: "/", Name: "Slash"},
		{ID: "rshft", Name: "Shift (Right)"},
		{ID: "up", Name: "Up"},
		{ID: "pdn", Name: "Page Down"},
		{ID: "hk9", Name: "FN"},
		{ID: "lctrl", Name: "Ctrl (Left)"},
		{ID: "lwin", Name: "Win (Left)"},
		{ID: "lalt", Name: "Alt (Left)"},
		{ID: "lspc", Name: "Space (Left)"},
		{ID: "rspc", Name: "Space (Right)"},
		{ID: "ralt", Name: "Alt (Right)"},
		{ID: "rctrl", Name: "Ctrl (Right)"},
		{ID: "lft", Name: "Left"},
		{ID: "dwn", Name: "Down"},
		{ID: "rght", Name: "Right"},
	}, func(item *KeyInfo) (string, *KeyInfo) { return item.ID, item }),
}
